const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore

const index = require("./index");
const db = index.db;
db.settings({ignoreUndefinedProperties: true});

const isDeepEqual = (object1, object2) => {
  if (!object1 && !object2) return true;
  if (!object1 || !object2) return false;
  const objKeys1 = Object.keys(object1);
  const objKeys2 = Object.keys(object2);
  if (objKeys1.length !== objKeys2.length) return false;
  for (const key of objKeys1) {
    const value1 = object1[key];
    const value2 = object2[key];

    const isObjects = isObject(value1) && isObject(value2);

    if (
      (isObjects && !isDeepEqual(value1, value2)) ||
      (!isObjects && value1 !== value2)
    ) {
      return false;
    }
  }
  return true;
};

const isObject = (object) => {
  return object != null && typeof object === "object";
};

exports.denormalizeSupplier = functions.region("asia-southeast2").firestore
    .document("suppliers/{supplierId}")
    .onUpdate( async (change, context) => {
      const newValue = change.after.data();
      const oldValue = change.before.data();
      if (newValue.name !== oldValue.name ||
        newValue.productGroup !== oldValue.productGroup ||
        newValue.logo !== oldValue.logo ||
        !isDeepEqual(newValue.overviewKeys, oldValue.overviewKeys)) {
        const supplierData = {
          "supplier.name": newValue.name,
          "supplier.logo": newValue.logo,
          "supplier.productGroup": newValue.productGroup,
          "supplier.overviewKeys": newValue.overviewKeys,
        };
        const supplierId = context.params.supplierId;
        const batch = db.batch();
        // Products
        const productsSnapshot = await db.collection("products")
            .where("supplier.id", "==", supplierId).get();
        if (!productsSnapshot.empty) {
          productsSnapshot.forEach((doc) => {
            batch.update(doc.ref, supplierData);
            // eslint-disable-next-line max-len
            functions.logger.log(`Successfully updated product with id ${doc.id}`);
          });
        } else {
          // eslint-disable-next-line max-len
          functions.logger.log(`Could not find any products with supplier id ${supplierId}`);
        }
        // Product Items
        const productItemsSnapshot = await db.collection("productItems")
            .where("supplier.id", "==", supplierId).get();
        if (!productItemsSnapshot.empty) {
          productItemsSnapshot.forEach((doc) => {
            batch.update(doc.ref, supplierData);
            // eslint-disable-next-line max-len
            functions.logger.log(`Successfully updated product item with id ${doc.id}`);
          });
        } else {
          // eslint-disable-next-line max-len
          functions.logger.log(`Could not find any product items with supplier id ${supplierId}`);
        }
        await batch.commit();
        // eslint-disable-next-line max-len
        return functions.logger.log("Successfully updated all products and productItems");
      } else {
        return functions.logger.log("No denormalized supplier data.");
      }
    });

exports.denormalizeProduct = functions.region("asia-southeast2").firestore
    .document("products/{productId}")
    .onUpdate( async (change, context) => {
      const newValue = change.after.data();
      const oldValue = change.before.data();
      if (newValue.name !== oldValue.name ||
        newValue.imagesList[0] !== oldValue.imagesList[0] ||
        isDeepEqual(newValue.categories, oldValue.categories)) {
        const productId = context.params.productId;
        const batch = db.batch();
        const productData = {
          name: newValue.name,
          photo: newValue.imagesList[0],
          categories: newValue.categories,
        };
        functions.logger.log("product data: ", productData);
        // Product Items
        const productItemsSnapshot = await db.collection("productItems")
            .where("productId", "==", productId).get();
        if (!productItemsSnapshot.empty) {
          productItemsSnapshot.forEach((doc) => {
            batch.update(doc.ref, productData);
            // eslint-disable-next-line max-len
            functions.logger.log(`Successfully updated product item with id ${doc.id}`);
          });
        } else {
          // eslint-disable-next-line max-len
          functions.logger.log(`Could not find any product items with supplier id ${productId}`);
        }
        await batch.commit();
      } else {
        return functions.logger.log("No denormalized data");
      }
    });

exports.denormalizeUser = functions.region("asia-southeast2").firestore
    .document("users/{userId}")
    .onUpdate( async (change, context) => {
      const newValue = change.after.data();
      const oldValue = change.before.data();
      if (newValue.photoURL === oldValue.photoURL &&
      newValue.displayName === oldValue.displayName) {
        return functions.logger.log("No denormalized data");
      }
      const userId = context.params.userId;
      const batch = db.batch();
      // Posts author on the feed
      const feedItemsSnapshot = await db.collection("feedItems")
          .where("user.id", "==", userId).get();
      if (!feedItemsSnapshot.empty) {
        feedItemsSnapshot.forEach((doc) => {
          batch.update(doc.ref, {
            "user.photo": newValue.photoURL,
            "user.name": newValue.displayName,
          });
          functions.logger.log(`Successfully updated FeedItem: ${doc.id}`);
        });
      } else {
        functions.logger.log("Could not find Feed Items");
      }
      // Followed User in Follow Items
      const followedUserSnapshot = await db.collection("followItems")
          .where("followedUser.id", "==", userId).get();
      if (!followedUserSnapshot.empty) {
        followedUserSnapshot.forEach((doc) => {
          batch.update(doc.ref, {
            "followedUser.photo": newValue.photoURL,
            "followedUser.name": newValue.displayName,
          });
          functions.logger.log(`Successfully updated Followed User: ${doc.id}`);
        });
      } else {
        functions.logger.log("Could not find Followed User");
      }
      // Following User in Follow Items;
      const followingUserSnapshot = await db.collection("followItems")
          .where("followingUser.id", "==", userId).get();
      if (!followingUserSnapshot.empty) {
        followingUserSnapshot.forEach((doc) => {
          batch.update(doc.ref, {
            "followingUser.photo": newValue.photoURL,
            "followingUser.name": newValue.displayName,
          });
          // eslint-disable-next-line max-len
          functions.logger.log(`Successfully updated Following User: ${doc.id}`);
        });
      } else {
        functions.logger.log("Could not find Following User");
      }
      // Post Detail
      const postsSnapshot = await db.collection("posts")
          .where("user.id", "==", userId).get();
      if (!postsSnapshot.empty) {
        postsSnapshot.forEach((doc) => {
          batch.update(doc.ref, {
            "user.photo": newValue.photoURL,
            "user.name": newValue.displayName,
          });
          functions.logger.log(`Successfully updated Post Detail: ${doc.id}`);
        });
      } else {
        functions.logger.log("Could not find Post Detail");
      }
      // Folder items
      const folderItemsSnapshot = await db.collection("folderItems")
          .where("postData.user.id", "==", userId).get();
      if (!folderItemsSnapshot.empty) {
        folderItemsSnapshot.forEach((doc) => {
          batch.update(doc.ref, {
            "postData.user.photo": newValue.photoURL,
            "postData.user.name": newValue.displayName,
          });
          functions.logger.log(`Successfully updated folder item: ${doc.id}`);
        });
      } else {
        functions.logger.log("Could not find folder items");
      }
      // Comments
      const commentsSnapshot = await db.collectionGroup("comments")
          .where("user.id", "==", userId).get();
      if (!commentsSnapshot.empty) {
        commentsSnapshot.forEach((doc) => {
          batch.update(doc.ref, {
            "user.photo": newValue.photoURL,
            "user.name": newValue.displayName,
          });
          functions.logger.log(`Successfully updated Comment: ${doc.id}`);
        });
      } else {
        functions.logger.log("Could not find comments");
      }
      // Replies
      const repliesSnapshot = await db.collectionGroup("replies")
          .where("user.id", "==", userId).get();
      if (!repliesSnapshot.empty) {
        repliesSnapshot.forEach((doc) => {
          batch.update(doc.ref, {
            "user.photo": newValue.photoURL,
            "user.name": newValue.displayName,
          });
          functions.logger.log(`Successfully updated Reply: ${doc.id}`);
        });
      } else {
        functions.logger.log("Could not find replies");
      }
      // Notification received by users
      const notificationsSnapshot = await db.collectionGroup("notifications")
          .where("user.id", "==", userId).get();
      if (!notificationsSnapshot.empty) {
        notificationsSnapshot.forEach((doc) => {
          batch.update(doc.ref, {
            "user.photo": newValue.photoURL,
            "user.name": newValue.displayName,
          });
          functions.logger.log(`Successfully updated Notification: ${doc.id}`);
        });
      } else {
        functions.logger.log("Could not find notifications");
      }
      await batch.commit();
      functions.logger.log("Successfully updated all Profile photos");
    });

exports.denormalizePost = functions.region("asia-southeast2").firestore
    .document("posts/{postId}")
    .onUpdate(async (change, context) => {
      const newValue = change.after.data();
      const oldValue = change.before.data();
      // eslint-disable-next-line max-len
      const hasImages = newValue.imagesList && newValue.imagesList.length ? true : false;
      if (newValue.title === oldValue.title &&
        isDeepEqual(newValue.imagesList, oldValue.imagesList)) {
        return functions.logger.log("No denormalized data.");
      }
      const postId = context.params.postId;
      functions.logger.log("postId: ", postId);
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
          batch.update(docRef, hasImages ? {
            title: newValue.title,
            imagesList: newValue.imagesList,
          } : {
            title: newValue.title,
          });
          functions.logger.log("Successfully updated Feed Item");
        });
      }
      // Update Folder Items
      const folderItemsSnapshot = await db.collection("folderItems")
          .where("postData.id", "==", postId).get();
      if (folderItemsSnapshot.size) {
        (folderItemsSnapshot).forEach((doc) => {
          batch.update(doc.ref, hasImages ? {
            "postData.title": newValue.title,
            "postData.image": newValue.imagesList[0],
          } : {
            "postData.title": newValue.title,
          });
        });
      } else {
        functions.logger.log("No folder items found");
      }
      await batch.commit();
    });


