// firebase admin sdk config
import admin from "firebase-admin";
import { config as dotenvConfig } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenvConfig();
}
// Providing a service account object inline - only necessary credentials
if (!admin.apps.length) {
  const config = {
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  };
  admin.initializeApp(config);
}

export default admin;
