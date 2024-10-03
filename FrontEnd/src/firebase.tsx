// v9 compat packages are API compatible with v8 code
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/auth";
import { TFirebaseConfig } from "./lib/types";
import {
  getMessaging,
  getToken,
  MessagePayload as FirebaseMessagePayload,
  onMessage,
} from "firebase/messaging";

import { sendFcmTokenToBackend } from "./utils/http";

// Firebase configuration
const firebaseConfig: TFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Export Firebase auth module
export const auth = app.auth();
export const db = app.firestore();
export const messaging = getMessaging(app);
export default app;

// Messaging setup

// Function to request FCM token
export const requestFCMToken = async () => {
  try {
    const permissionGranted = await Notification.requestPermission();
    if (permissionGranted === "granted") {
      console.log("Notification permission granted.");
      const FRMtoken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      console.log("FCM Token:", FRMtoken);
      // Send this token to your backend for future notifications

      await sendFcmTokenToBackend(FRMtoken);
      localStorage.setItem("fcmToken", FRMtoken);
    } else if (permissionGranted === "denied") {
      console.log("Notification permission denied.");
      alert("You have denied the notification permission.");
    } else {
      console.log("Unable to get permission to notify.");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while retrieving token:", error);
  }
  return null;
};

export function listenForMessages() {
  // Firebase Cloud Messaging (FCM) message listener for foreground messages
}
