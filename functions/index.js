const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
exports.db = db;

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.incrementCounter = functions.firestore
    .document("users/{userId}/notifications/{notificationId}")
    .onCreate( async (snap, context) => {
      functions.logger.log(context.params.notificationId);
      const userId = snap.data().userId;
      if (!userId) return;
      const increment = admin.firestore.FieldValue.increment(1);
      const userRef = db.collection("users").doc(userId);
      const res = await userRef.set({
        counter: increment,
      }, {merge: true});
      functions.logger.log("Successfully incremented counter: ", res);
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

exports.denormalization = require("./denormalization");
exports.emailtriggers = require("./emailtriggers");
exports.follow = require("./follow");
// exports.images = require("./images");
