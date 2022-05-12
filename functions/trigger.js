// const admin = require("firebase-admin");
const functions = require("firebase-functions");
const {PubSub} = require("@google-cloud/pubsub");

// if (!admin.apps.length) {
//   admin.initializeApp();
// }

const pubsub = new PubSub({
  projectId: "hunyo-109e6",
  apiEndpoint: "localhost:8085",
});

const SCHEDULED_FUNCTION_TOPIC = "firebase-schedule-cron-migrateImages";
// eslint-disable-next-line max-len
functions.logger.log(`Trigger schedules function via PubSub: ${SCHEDULED_FUNCTION_TOPIC}`);
const msg = pubsub.topic(SCHEDULED_FUNCTION_TOPIC).publishJSON({
  foo: "bar",
}, {attrs1: "value1"}).then(() => {
  functions.logger.log(msg);
});
