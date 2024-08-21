const admin = require("firebase-admin");
const config = require("./config").firebaseConfig;

admin.initializeApp({
  credential: admin.credential.cert(config),
  storageBucket: process.env.FIREBASE_CONFIG_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

module.exports = bucket;
