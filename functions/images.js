/* eslint-disable max-len */
const functions = require("firebase-functions");
const spawn = require("child-process-promise").spawn;
const path = require("path");
const os = require("os");
const fs = require("fs");
// // The Firebase Admin SDK to access Firestore
const index = require("./index");
// const db = index.db;
const bucket = index.bucket;


exports.cropImages = functions.region("asia-southeast2").https.onCall(async ({imagesListWithFilePath}, context) => {
  // Crop images simultaneously
  const promises = [];
  for (const image of imagesListWithFilePath) {
    const promise = cropImage(image);
    promises.push(promise);
  }
  const tempFilePaths = await Promise.all(promises);
  functions.logger.log(tempFilePaths);
  // Remove files from temporary storage
  for (const pathObject of tempFilePaths) {
    functions.logger.log(pathObject);
    fs.unlinkSync(pathObject.tempFilePath);
    fs.unlinkSync(pathObject.tempNewFilePath);
  }
  return;
});

const cropImage = async (image) => {
  try {
    functions.logger.log("Managing image named: ", image.id);
    // Download image from storage and store in temp directory
    const tempFilePath = path.join(os.tmpdir(), image.id);
    const tempNewFilePath = `${tempFilePath}.jpg`;
    await bucket.file(image.filePath).download({destination: tempFilePath});
    // Crop and resize image
    const {x, y, width, height} = image.cropData;
    functions.logger.log("x: ", x, "y: ", y, "width: ", width, "height: ", height);
    await spawn("convert", [tempFilePath, "-virtual-pixel", "white", "-define", `distort:viewport=${width}x${height}+${x}+${y}`, "-distort", "SRT", "0", "+repage", "-resize", "1080", tempNewFilePath]);
    functions.logger.log("Successfully cropped and resized image!");
    // Upload cropped image
    await bucket.upload(tempNewFilePath, {
      destination: image.filePath,
      metadata: {
        contentType: "image/jpeg",
      },
    });
    functions.logger.log("Successfully uploaded cropped image!");
    functions.logger.log(tempFilePath, tempNewFilePath);
    return {tempFilePath, tempNewFilePath};
  } catch (error) {
    functions.logger.log(error);
    return;
  }
};
