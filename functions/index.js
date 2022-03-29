const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.incrementCounter = functions.firestore
    .document("users/{userId}/notifications/{notificationId}")
    .onCreate( async (snap, context) => {
      try {
        const userId = snap.data().userId;
        const notificationPath = `users/${userId}/notifications`;
        let newCount = 1;
        const counter = await db
            .collection(notificationPath)
            .doc("counter").get();
        if (counter.exists) {
          const counterValue = counter.data().value;
          newCount = counterValue + 1;
        }
        const res = await db
            .collection(notificationPath)
            .doc("counter").set({
              value: newCount,
            });
        functions.logger
            .log("Successfully incremented counter: ", res);
      } catch (error) {
        functions.logger.log(error.message);
      }
    });

exports.removeComment = functions.firestore
    .document("posts/{postId}/comments/{commentId}")
    .onDelete( async (snapshot, context) => {
      const postId = context.params.postId;
      const commentId = context.params.commentId;
      const colPath = `posts/${postId}/comments/${commentId}/replies`;
      const repliesSnapshot = await db.collection(colPath).get();
      if (repliesSnapshot.empty) {
        functions.logger.log("Documents not found");
        return;
      }
      const batch = db.batch();
      repliesSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
        functions.logger.log("Deleted: ", doc.data());
      });
      await batch.commit();
    });

exports.manageUserName = functions.firestore
    .document("users/{userId}")
    .onUpdate( async (change, context) => {
      const newValue = change.after.data();
      const oldValue = change.before.data();
      if (newValue.displayName === oldValue.displayName) {
        return functions.logger.log("No denormalized data");
      }
      const userId = context.params.userId;
      // Recommendations and Posts author on the feed
      const feedItemsSnapshot = await db.collection("feedItems")
          .where("user.id", "==", userId).get();
      if (!feedItemsSnapshot.empty) {
        feedItemsSnapshot.forEach((doc) => {
          doc.ref.update({
            "user.name": newValue.displayName,
          })
              .then((res) => functions.logger
                  .log("Successfully updated FeedItem"))
              .catch((err) => functions.logger.log(err));
        });
      } else {
        functions.logger.log("Could not find Feed Items");
      }
      // Person being recommended
      const recommendedPostsSnapshot = await db.collection("feedItems")
          .where("postData.user.id", "==", userId).get();
      if (!recommendedPostsSnapshot.empty) {
        recommendedPostsSnapshot.forEach((doc) => {
          doc.ref.update({
            "postData.user.name": newValue.displayName,
          })
              .then((res) => functions.logger
                  .log("Successfully updated Recommend Object"))
              .catch((err) => functions.logger.log(err));
        });
      } else {
        functions.logger.log("Could not find Recommend Object");
      }
      // Post cards saved inside folders
      const folderItemsSnapshot = await db.collection("folderItems")
          .where("postData.user.id", "==", userId).get();
      if (!folderItemsSnapshot.empty) {
        folderItemsSnapshot.forEach((doc) => {
          doc.ref.update({
            "postData.user.name": newValue.displayName,
          })
              .then((res) => functions.logger
                  .log("Successfully updated FolderItem"))
              .catch((err) => functions.logger.log(err));
        });
      } else {
        functions.logger.log("Could not find Recommend Folder Items");
      }
      // Followed User in Follow Items
      const followedUserSnapshot = await db.collection("followItems")
          .where("followedUser.id", "==", userId).get();
      if (!followedUserSnapshot.empty) {
        followedUserSnapshot.forEach((doc) => {
          doc.ref.update({
            "followedUser.name": newValue.displayName,
          })
              .then((res) => functions.logger
                  .log("Successfully updated Followed User"))
              .catch((err) => functions.logger.log(err));
        });
      } else {
        functions.logger.log("Could not find Followed User");
      }
      // Following User in Follow Items;
      const followingUserSnapshot = await db.collection("followItems")
          .where("followingUser.id", "==", userId).get();
      if (!followingUserSnapshot.empty) {
        followingUserSnapshot.forEach((doc) => {
          doc.ref.update({
            "followingUser.name": newValue.displayName,
          })
              .then((res) => functions.logger
                  .log("Successfully updated Following User"))
              .catch((err) => functions.logger.log(err));
        });
      } else {
        functions.logger.log("Could not find Following User");
      }
      // Post Detail
      const postsSnapshot = await db.collection("posts")
          .where("user.id", "==", userId).get();
      if (!postsSnapshot.empty) {
        postsSnapshot.forEach((doc) => {
          doc.ref.update({
            "user.name": newValue.displayName,
          })
              .then((res) => functions.logger
                  .log("Successfully updated Post Detail"))
              .catch((err) => functions.logger.log(err));
        });
      } else {
        functions.logger.log("Could not find Post Detail");
      }
      // Comments
      const commentsSnapshot = await db.collectionGroup("comments")
          .where("user.id", "==", userId).get();
      if (!commentsSnapshot.empty) {
        commentsSnapshot.forEach((doc) => {
          doc.ref.update({
            "user.name": newValue.displayName,
          })
              .then((res) => functions.logger
                  .log("Successfully updated Comment"))
              .catch((err) => functions.logger.log(err));
        });
      } else {
        functions.logger.log("Could not find comments");
      }
      // Replies
      const repliesSnapshot = await db.collectionGroup("replies")
          .where("user.id", "==", userId).get();
      if (!repliesSnapshot.empty) {
        repliesSnapshot.forEach((doc) => {
          doc.ref.update({
            "user.name": newValue.displayName,
          })
              .then((res) => functions.logger
                  .log("Successfully updated Reply"))
              .catch((err) => functions.logger.log(err));
        });
      } else {
        functions.logger.log("Could not find replies");
      }
      // Notification received by users
      const notificationsSnapshot = await db.collectionGroup("notifications")
          .where("user.id", "==", userId).get();
      if (!notificationsSnapshot.empty) {
        notificationsSnapshot.forEach((doc) => {
          doc.ref.update({
            "user.name": newValue.displayName,
          })
              .then((res) => functions.logger
                  .log("Successfully updated Notification"))
              .catch((err) => functions.logger.log(err));
        });
      } else {
        functions.logger.log("Could not find notifications");
      }
    });

exports.manageUserPhoto = functions.firestore
    .document("users/{userId}")
    .onUpdate( async (change, context) => {
      const newValue = change.after.data();
      const oldValue = change.before.data();
      if (newValue.photoURL === oldValue.photoURL) {
        return functions.logger.log("No denormalized data");
      }
      const userId = context.params.userId;
      // Recommendations and Posts author on the feed
      const feedItemsSnapshot = await db.collection("feedItems")
          .where("user.id", "==", userId).get();
      if (!feedItemsSnapshot.empty) {
        feedItemsSnapshot.forEach((doc) => {
          doc.ref.update({
            "user.photo": newValue.photoURL,
          })
              .then((res) => functions.logger
                  .log("Successfully updated FeedItem"))
              .catch((err) => functions.logger.log(err));
        });
      } else {
        functions.logger.log("Could not find Feed Items");
      }
      // Person being recommended
      const recommendedPostsSnapshot = await db.collection("feedItems")
          .where("postData.user.id", "==", userId).get();
      if (!recommendedPostsSnapshot.empty) {
        recommendedPostsSnapshot.forEach((doc) => {
          doc.ref.update({
            "postData.user.photo": newValue.photoURL,
          })
              .then((res) => functions.logger
                  .log("Successfully updated Recommend Object"))
              .catch((err) => functions.logger.log(err));
        });
      } else {
        functions.logger.log("Could not find Recommend Object");
      }
      // Post cards saved inside folders
      const folderItemsSnapshot = await db.collection("folderItems")
          .where("postData.user.id", "==", userId).get();
      if (!folderItemsSnapshot.empty) {
        folderItemsSnapshot.forEach((doc) => {
          doc.ref.update({
            "postData.user.photo": newValue.photoURL,
          })
              .then((res) => functions.logger
                  .log("Successfully updated FolderItem"))
              .catch((err) => functions.logger.log(err));
        });
      } else {
        functions.logger.log("Could not find Recommend Folder Items");
      }
      // Followed User in Follow Items
      const followedUserSnapshot = await db.collection("followItems")
          .where("followedUser.id", "==", userId).get();
      if (!followedUserSnapshot.empty) {
        followedUserSnapshot.forEach((doc) => {
          doc.ref.update({
            "followedUser.photo": newValue.photoURL,
          })
              .then((res) => functions.logger
                  .log("Successfully updated Followed User"))
              .catch((err) => functions.logger.log(err));
        });
      } else {
        functions.logger.log("Could not find Followed User");
      }
      // Following User in Follow Items;
      const followingUserSnapshot = await db.collection("followItems")
          .where("followingUser.id", "==", userId).get();
      if (!followingUserSnapshot.empty) {
        followingUserSnapshot.forEach((doc) => {
          doc.ref.update({
            "followingUser.photo": newValue.photoURL,
          })
              .then((res) => functions.logger
                  .log("Successfully updated Following User"))
              .catch((err) => functions.logger.log(err));
        });
      } else {
        functions.logger.log("Could not find Following User");
      }
      // Post Detail
      const postsSnapshot = await db.collection("posts")
          .where("user.id", "==", userId).get();
      if (!postsSnapshot.empty) {
        postsSnapshot.forEach((doc) => {
          doc.ref.update({
            "user.photo": newValue.photoURL,
          })
              .then((res) => functions.logger
                  .log("Successfully updated Post Detail"))
              .catch((err) => functions.logger.log(err));
        });
      } else {
        functions.logger.log("Could not find Post Detail");
      }
      // Comments
      const commentsSnapshot = await db.collectionGroup("comments")
          .where("user.id", "==", userId).get();
      if (!commentsSnapshot.empty) {
        commentsSnapshot.forEach((doc) => {
          doc.ref.update({
            "user.photo": newValue.photoURL,
          })
              .then((res) => functions.logger
                  .log("Successfully updated Comment"))
              .catch((err) => functions.logger.log(err));
        });
      } else {
        functions.logger.log("Could not find comments");
      }
      // Replies
      const repliesSnapshot = await db.collectionGroup("replies")
          .where("user.id", "==", userId).get();
      if (!repliesSnapshot.empty) {
        repliesSnapshot.forEach((doc) => {
          doc.ref.update({
            "user.photo": newValue.photoURL,
          })
              .then((res) => functions.logger
                  .log("Successfully updated Reply"))
              .catch((err) => functions.logger.log(err));
        });
      } else {
        functions.logger.log("Could not find replies");
      }
      // Notification received by users
      const notificationsSnapshot = await db.collectionGroup("notifications")
          .where("user.id", "==", userId).get();
      if (!notificationsSnapshot.empty) {
        notificationsSnapshot.forEach((doc) => {
          doc.ref.update({
            "user.photo": newValue.photoURL,
          })
              .then((res) => functions.logger
                  .log("Successfully updated Notification"))
              .catch((err) => functions.logger.log(err));
        });
      } else {
        functions.logger.log("Could not find notifications");
      }
    });
