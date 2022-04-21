/* eslint-disable max-len */

const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore

const index = require("./index");
const db = index.db;

exports.emailNotifications = functions.firestore
    .document("users/{userId}/notifications/{notificationId}")
    .onCreate( async (snap, context) => {
      const docData = snap.data();
      const content = docData.content ? docData.content : null;
      const {type, user, userId, route} = docData;
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

      if (type === "postComment") {
        subject = `${user.name} commented on your Hunyo post`;
        message = `${user.name} commented on your Hunyo post: ${content}`;
        buttonMessage = "View Now";
        url = `https://hunyo.com/#/posts/${route.params.postId}`;
      } else if (type === "postReply") {
        subject = `${user.name} replied to your comment on Hunyo`;
        message = `${user.name} replied to your comment on Hunyo`;
        buttonMessage = "View Now";
        url = `https://hunyo.com/#/posts/${route.params.postId}`;
      } else if (type === "followerNew") {
        subject = "You have a new subscriber on Hunyo";
        message = "You have a new subscriber on Hunyo";
        buttonMessage = "View Subscriber's Profile";
        url = `https://hunyo.com/#/members/${route.params.userId}`;
      } else if (type === "followPost") {
        subject = `${user.name} created a new Hunyo post`;
        message = `${user.name} created a new Hunyo post`;
        buttonMessage = "View Post";
        url = `https://hunyo.com/#/posts/${route.params.postId}`;
      } else {
        functions.logger.log("No email for that notification type yet");
        return;
      }

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
