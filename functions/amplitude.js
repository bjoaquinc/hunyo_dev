/* eslint-disable require-jsdoc */
const functions = require("firebase-functions");
const express = require("express");
const app = express();
const cors = require("cors");
// eslint-disable-next-line max-len
const {createProxyMiddleware, fixRequestBody} = require("http-proxy-middleware");

// eslint-disable-next-line max-len
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({origin: true}));

app.use("/", createProxyMiddleware({
  target: "https://api.amplitude.com/",
  changeOrigin: true,
  pathRewrite: {"/amplitude": ""},
  onProxyReq: fixRequestBody,
}));

exports.reverseProxy = functions.https.onRequest(app);
