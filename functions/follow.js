const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore
const admin = require("firebase-admin");
const index = require("./index");
const db = index.db;

exports.incrementFollowCreate = functions.firestore
    .document("followItems/{followItemId}")
    .onCreate( async (snap, context) => {
      const increment = admin.firestore.FieldValue.increment(1);
      //  Followed User
      const followedUserId = snap.data().followedUser.id;
      const followedUserRef = db.collection("users").doc(followedUserId);
      const followedUserDoc = await followedUserRef.get().catch((error) => {
        functions.logger.log(error);
      });
      if (followedUserDoc.exists) {
        const res = await followedUserRef.update({
          followers: increment,
        });
        // eslint-disable-next-line max-len
        functions.logger.log(`Successfully incremented follower to ${followedUserDoc.data().displayName}: `, res);
      } else {
        functions.logger.log("Could not find followed user");
        return;
      }
      //  Following User
      const followingUserId = snap.data().followingUser.id;
      const followingUserRef = db.collection("users").doc(followingUserId);
      const followingUserDoc = await followingUserRef.get().catch((error) => {
        functions.logger.log(error);
      });
      if (followingUserDoc.exists) {
        const res = await followingUserRef.update({
          following: increment,
        });
        // eslint-disable-next-line max-len
        functions.logger.log(`Successfully incremented following to ${followingUserDoc.data().displayName}: `, res);
      } else {
        functions.logger.log("Could not find following user");
        return;
      }
    });

exports.toggleFollow = functions.firestore
    .document("followItems/{followItemId}")
    .onUpdate( async (change, context) => {
      const increment = admin.firestore.FieldValue.increment(1);
      const decrement = admin.firestore.FieldValue.increment(-1);
      const beforeData = change.before.data();
      const afterData = change.after.data();
      //  Followed User
      const followedUserId = afterData.followedUser.id;
      const followedUserRef = db.collection("users").doc(followedUserId);
      // eslint-disable-next-line max-len
      const followedUserDoc = await followedUserRef.get().catch((error) => functions.logger.log(error));
      //  Following User
      const followingUserId = afterData.followingUser.id;
      const followingUserRef = db.collection("users").doc(followingUserId);
      // eslint-disable-next-line max-len
      const followingUserDoc = await followingUserRef.get().catch((error) => functions.logger.log(error));
      //  Follow logic
      if (beforeData.isFollowing !== afterData.isFollowing) {
        //  Increment Following and Followers
        if (afterData.isFollowing === true) {
          await followedUserRef.update({
            followers: increment,
          });
          await followingUserRef.update({
            following: increment,
          });
          // eslint-disable-next-line max-len
          functions.logger.log(`Successfully incremented followers of ${followedUserDoc.data().displayName} 
          and following of ${followingUserDoc.data().displayName}`);
          //  Decrement Following and Followers
        } else {
          await followedUserRef.update({
            followers: decrement,
          });
          await followingUserRef.update({
            following: decrement,
          });
          // eslint-disable-next-line max-len
          functions.logger.log(`Successfully decremented followers of ${followedUserDoc.data().displayName} 
          and following of ${followingUserDoc.data().displayName}`);
        }
      } else {
        functions.logger.log("Following status has not been updated");
      }
    });
