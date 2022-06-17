import amplitude from 'amplitude-js'

let project = process.env.AMP_API_KEY_PROD
let message = "Running on Production"
let analyticsProxy = "hunyo.com/amplitude"
if (location.hostname === 'localhost' || location.hostname === "127.0.0.1") {
  project = process.env.AMP_API_KEY_DEV
  analyticsProxy = `${location.hostname}:5000/amplitude`
  message = "Running on Development"
}
console.log(message)

// init Amplitude
if (location.port && location.port === "8080") {
  amplitude.getInstance().init(project);
} else {
  amplitude.getInstance().init(project, null, {
    apiEndpoint: analyticsProxy,
    forceHttps: false,
  });
}
