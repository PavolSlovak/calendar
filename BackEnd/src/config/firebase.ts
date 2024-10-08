// firebase admin sdk config
import admin from "firebase-admin";
import sendNotif from "./sendNotif.js";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  console.log("Firebase admin SDK already initialized");
}

// Send a notification
/* sendNotif("fcmToken", "title", "body");
 */
export default admin;
