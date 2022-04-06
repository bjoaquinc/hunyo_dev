import amplitude from 'amplitude-js'

let project = process.env.AMP_API_KEY_PROD
let message = "Running on Production"
if (location.hostname === 'localhost' || location.hostname === "127.0.0.1") {
  project = process.env.AMP_API_KEY_DEV
  message = "Running on Development"
}
console.log(message)

// init Amplitude
var instance1 = amplitude.getInstance().init("337543a6c69e641a5f6a969752e2e7f5");

export { instance1 }

// Sample code
// amplitude.getInstance().setUserId("user-id");
// amplitude.getInstance().logEvent("event-name");