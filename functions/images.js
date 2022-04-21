/* eslint-disable max-len */
// /* eslint-disable max-len */
// const functions = require("firebase-functions");
// const spawn = require("child-process-promise").spawn;
// const path = require("path");
// const os = require("os");
// const fs = require("fs");
// // The Firebase Admin SDK to access Firestore
// const admin = require("firebase-admin");
// // const index = require("./index");
// // const db = index.db;


// exports.cropImage = functions.storage.object().onFinalize(async (object) => {
//   const fileBucket = object.bucket; // The Storage bucket that contains the file.
//   const filePath = object.name; // File path in the bucket.
//   const contentType = object.contentType; // File content type.
//   const bucket = admin.storage().bucket(fileBucket);
//   const tempFilePath = path.join(os.tmpdir(), fileName);
//   const metadata = {
//     contentType: contentType,
//   };
//   // Exit if this is triggered on a file that is not an image.
//   if (!contentType.startsWith("image/")) {
//     return functions.logger.log("This is not an image.");
//   }

//   // Get the file name.
//   const fileName = path.basename(filePath);
//   // Exit if the image is already a thumbnail.
//   if (fileName.startsWith("thumb_")) {
//     return functions.logger.log("Already a Thumbnail.");
//   }
//   await bucket.file(filePath).download({destination: tempFilePath});
//   functions.logger.log("Image downloaded locally to", tempFilePath);
//   // Generate a thumbnail using ImageMagick.
//   await spawn("convert", [tempFilePath, "-thumbnail", "200x200>", tempFilePath]);
//   functions.logger.log("Thumbnail created at", tempFilePath);
//   // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
//   const thumbFileName = `thumb_${fileName}`;
//   const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
//   // Uploading the thumbnail.
//   await bucket.upload(tempFilePath, {
//     destination: thumbFilePath,
//     metadata: metadata,
//   });
//   // Once the thumbnail has been uploaded delete the local file to free up disk space.
//   return fs.unlinkSync(tempFilePath);
// });
