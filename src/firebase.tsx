import firebase from "firebase/app";
import { getAuth } from "firebase/auth"; // New import
import { TFirebaseConfig } from "./lib/types";
const firebaseConfig: TFirebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};
const app = firebase.initializeApp(firebaseConfig);
// Export Firebase auth module
export const auth = getAuth(app);
export default app;
