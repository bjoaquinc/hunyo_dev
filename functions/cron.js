const functions = require("firebase-functions");
const MailchimpApi = require("mailchimp-api-v3");
const md5 = require("crypto-js/md5");

const index = require("./index");
const db = index.db;
const bucket = index.bucket;

const CRON_SCHEDULE = "* * * * *";

exports.cronMailChimp = functions.region("asia-southeast2")
    .pubsub.schedule(CRON_SCHEDULE)
    .timeZone("Asia/Manila")
    .onRun(async (context) => {
      const {audience, apikey} = functions.config().mailchimp;
      if (!audience || !apikey) {
        // eslint-disable-next-line max-len
        throw new Error(`Missing mailchimp config! Current config is ${JSON.stringify(functions.config(), null, 2)}`);
      }
      const mailchimpApi = new MailchimpApi(apikey);
      const usersRefs = await db.collection("registrations").listDocuments();
      for (const userRef of usersRefs) {
        const userDoc = await userRef.get();
        const user = userDoc.data();
        // eslint-disable-next-line max-len
        functions.logger.log(`mailchimp: handling ${userRef.id} with email ${user.emailAddress}`);
        try {
          await patchContact(mailchimpApi, audience, user);
          functions.logger.log("mailchimp: user updated!");
        } catch (error) {
          // eslint-disable-next-line max-len
          functions.logger.log("mailchimp: catched updated error (probably contact does not exist", error);
          try {
            await createContact(mailchimpApi, audience, user);
            functions.logger.log("mailchimp: user created!");
          } catch (error) {
            functions.logger.log("mailchimp: failed to create contact!", error);
          }
        }
      }
    });

const createContact = async (mailchimpApi, audienceId, user) => {
  const body = {
    email_address: user.emailAddress,
    status: "subscribed",
    merge_fields: {
      FNAME: user.firstName,
      LNAME: user.lastName,
    },
  };
  return mailchimpApi.post(`/lists/${audienceId}/members/`, body);
};

const patchContact = async (mailchimpApi, audienceId, user) => {
  const body = {
    merge_fields: {
      FNAME: user.firstName,
      LNAME: user.lastName,
    },
  };
  const memberId = md5(user.emailAddress.toLowerCase());
  return mailchimpApi.patch(`/lists/${audienceId}/members/${memberId}`, body);
};

exports.migrateImages = functions.region("asia-southeast2")
    .pubsub.schedule("* * * * *")
    .timeZone("Asia/Manila")
    .onRun(async (context) => {
      const postsRefs = await db.collection("posts").listDocuments();
      for (const postRef of postsRefs) {
        const postDoc = await postRef.get();
        if (postDoc.data().imagesList) {
          const postId = postRef.id;
          const {title, imagesList} = postDoc.data();
          // eslint-disable-next-line max-len
          functions.logger.log(`Migrating images for post ${postId} with title ${title}`);
          const newImagesList = [];
          for (const imageURL of imagesList) {
            try {
              const imageName = urlToFileName(imageURL);
              const imagePath = `images/${imageName}`;
              const newImagePath = `images/${postId}/${imageName}`;
              await bucket.file(imagePath)
                  .move(newImagePath);
              // eslint-disable-next-line max-len
              functions.logger.log(`Successfully moved image with name ${imageName}`);
              const newFile = bucket.file(newImagePath);
              const publicURL = newFile.publicUrl();
              newImagesList.push(publicURL);
            } catch (error) {
              functions.logger.log(error);
            }
          }
          try {
            await db.collection("posts").doc(postId).update({
              imagesList: newImagesList,
            });
            functions.logger.log("Successfully updated images list!");
          } catch (error) {
            functions.logger.log(error);
            functions.logger.log("Failed to update images list");
          }
        } else {
          functions.logger.log("This post does not have images");
        }
      }
    });

const urlToFileName = (url) => {
  const splitURL = url.split("/");
  const fileNameRaw = splitURL[splitURL.length - 1];
  const fileNameClean = fileNameRaw.split("%2F")[1].split("?")[0];
  return fileNameClean;
};

exports.testFunction = functions.region("asia-southeast2")
    .pubsub.schedule("* * * * *")
    .timeZone("Asia/Manila")
    .onRun((context) => {
      functions.logger.log("Hello World");
    });
