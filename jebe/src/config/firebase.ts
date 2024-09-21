// firebase admin sdk config
import admin from "firebase-admin";

// Providing a service account object inline - only necessary credentials
const config = {
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  }),
};
export const firebase = admin.apps.length
  ? admin.app()
  : admin.initializeApp(config);
