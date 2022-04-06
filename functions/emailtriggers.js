/* eslint-disable max-len */

const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore

const index = require("./index");
const db = index.db;

exports.emailNotifications = functions.firestore
    .document("users/{userId}/notifications/{notificationId}")
    .onCreate( async (snap, context) => {
      const docData = snap.data();
      functions.logger.log(docData);
      const content = docData.content ? docData.content : null;
      functions.logger.log(content);
      const {type, user, userId} = docData;
      functions.logger.log(type, user, userId);
      let userEmail = "";

      const recipient = await db.collection("users").doc(userId).get();
      if (recipient.exists) {
        userEmail = recipient.data().email;
      } else {
        functions.logger.log("Could not find user");
        return;
      }

      let message = "";
      let buttonMessage = "";
      let url = "";
      let subject = "";

      if (type === "postRead") {
        subject = `${user.name} viewed your Hunyo post`;
        message = `${user.name} viewed your Hunyo post: ${content}`;
        buttonMessage = "See the Designer's Profile";
        url = `https://hunyo.com/#/members/${user.id}`;
      } else {
        functions.logger.log("No email available for type yet");
        return;
      }

      // if (type === "postComment") {
      //   subject = `${user.name} commented on your Hunyo post`;
      //   message = `${user.name} commented on your Hunyo post: ${content}`;
      //   buttonMessage = "View Now";
      //   url = `https://hunyo.com/posts/${route.params.postId}`;
      // }

      // if (type === "postRecommend") {
      //   subject = `${user.name} recommended your Hunyo post`;
      //   message = `${user.name} recommended your Hunyo post: ${content}`;
      //   buttonMessage = "View Now";
      //   url = `https://hunyo.com/posts/${route.params.postId}`;
      // }

      const notificationTemplate = `
      <div style="margin-top: 30px; max-width: 500px">
          <img
            style="max-width: 200px; max-height: auto; margin: 15px"
            src="https://firebasestorage.googleapis.com/v0/b/hunyo-109e6.appspot.com/o/logo%2Flogo-full-small.png?alt=media&token=819cde9b-9106-4375-b6a2-901f35822840"
          />
          <div style="width: 100%; border-bottom: 1px solid rgba(0, 0, 0, 0.12)" />
          <p style="margin: 30px 0; font-size: 20px">
            ${message}
          </p>
          <a
            href="${url}"
            style="
              margin-bottom: 15px;
              border: 2px solid #7b95a3;
              background-color: #7b95a3;
              color: white;
              padding: 10px 20px;
              text-align: center;
              text-decoration: none;
              display: inline-block;
              font-size: 16px;
              font-weight: bold;
            "
            >${buttonMessage}</a
          >
          <div
            style="
              width: 100%;
              border-bottom: 1px solid rgba(0, 0, 0, 0.12);
              margin: 30px 0;
            "
          />
          <p style="color: #989898; font-size: 10px">
            If you don't want to receive these emails from Hunyo in the future,
            <span
              ><a href="" style="text-decoration: none; color: #7b95a3"
                >unsubscribe here</a
              ></span
            >
          </p>
        </div>
      `;

      const mail = {
        to: [userEmail],
        message: {
          subject: subject,
          html: notificationTemplate,
        },
      };
      const res = await db.collection("mail").add(mail);
      functions.logger.log("Successfully created email doc: ", res);
    });
