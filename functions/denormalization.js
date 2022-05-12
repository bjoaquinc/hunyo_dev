const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore

const index = require("./index");
const db = index.db;

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

exports.denormalizePostTitle = functions.firestore
    .document("posts/{postId}")
    .onUpdate(async (change, context) => {
      const title = change.before.data().title;
      const newTitle = change.after.data().title;
      const postId = context.params.postId;
      functions.logger.log("postId: ", postId);
      // eslint-disable-next-line max-len
      if (title === newTitle) return functions.logger.log("Title has not changed");
      const batch = db.batch();
      // Update Feed Item
      const feedItem = await db.collection("feedItems")
          .where("postId", "==", postId).get();
      if (feedItem.empty) {
        functions.logger.log("Could not find Feed Item");
        return;
      } else {
        feedItem.forEach((doc) => {
          const docRef = doc.ref;
          batch.update(docRef, {
            title: newTitle,
          });
          functions.logger.log("Successfully updated Feed Item");
        });
      }
      // Update Folder Items
      const folderItemsSnapshot = await db.collection("folderItems")
          .where("postData.id", "==", postId).get();
      if (folderItemsSnapshot.size) {
        (folderItemsSnapshot).forEach((doc) => {
          batch.update(doc.ref, {
            "postData.title": newTitle,
          });
        });
      } else {
        functions.logger.log("No folder items found");
      }
      await batch.commit();
    });

exports.denormalizePostImages = functions.firestore
    .document("posts/{postId}")
    .onUpdate(async (change, context) => {
      // eslint-disable-next-line max-len
      if (!change.before.data().imagesList) return functions.logger.log("No images list available");
      const imagesList = change.before.data().imagesList;
      const newImagesList = change.after.data().imagesList;
      functions.logger.log(imagesList, newImagesList);
      // eslint-disable-next-line max-len
      if (arrayEquals(imagesList, newImagesList)) return functions.logger.log("Images havent been changed");
      const postId = context.params.postId;
      const batch = db.batch();
      // Update Feed Item
      const feedItems = await db.collection("feedItems")
          .where("postId", "==", postId).get();
      if (feedItems.size) {
        feedItems.forEach((feedItem) => {
          batch.update(feedItem.ref, {
            "imagesList": newImagesList,
          });
        });
      } else {
        throw new Error("Cannot find feed item");
      }
      // Update Folder Items
      const folderItems = await db.collection("folderItems")
          .where("postData.id", "==", postId).get();
      if (folderItems.size) {
        folderItems.forEach((folderItem) => {
          batch.update(folderItem.ref, {
            "postData.image": newImagesList[0],
          });
          functions.logger.log(`Updated image for ${folderItem.id}`);
        });
      } else {
        functions.logger.log("No folder items");
      }
      await batch.commit();
      functions.logger.log(`Successfully updated all images for ${postId}`);
    });

const arrayEquals = (firstList, secondList) => {
  if (firstList.length !== secondList.length) return false;
  for (let index = 0; index < firstList.length; index++) {
    if (firstList[index] !== secondList[index]) return false;
  }
  return true;
};
