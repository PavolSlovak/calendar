// firebase admin sdk config
import admin from "firebase-admin";
import sendNotif from "./sendNotif.js";

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Send a notification
sendNotif("fcmToken", "title", "body");

export default admin;
