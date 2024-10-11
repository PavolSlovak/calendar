import { getToken, MessagePayload, onMessage } from "firebase/messaging";
import { db, messaging } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { sendNotif } from "../utils/http";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;
const FCM_TOKEN_COLLECTION = "fcmTokens";
// Requests permissions to show notifications.
async function requestNotificationsPermissions(uid: string) {
  console.log("Requesting notifications permission...");
  const permission = await Notification.requestPermission();
  console.log(permission); // "granted", "denied", or "default"

  if (permission === "granted") {
    console.log("Notification permission granted.");
    // Notification permission granted.
    await saveMessagingDeviceToken(uid);
  } else {
    console.log("Unable to get permission to notify.");
  }
}

// Saves the messaging device token to Cloud Firestore.
export async function saveMessagingDeviceToken(uid: string) {
  console.log("save msg device token");

  try {
    const msg: any = await messaging();
    const fcmToken = await getToken(msg, { vapidKey: VAPID_KEY });
    if (fcmToken) {
      console.log("Got FCM device token:", fcmToken);
      // Save device token to Firestore
      const tokenRef = doc(db, FCM_TOKEN_COLLECTION, uid);
      await setDoc(tokenRef, { fcmToken });

      // Trigger a notification to confirm that the device token is working.
      try {
        sendNotif(uid, "Test notification", "This is a test notification");
      } catch (error) {
        console.error("Error triggering notification:", error);
      }
      // When the app is in the background, firebase-messaging-sw.js will receive the message instead.
      onMessage(msg, (message: MessagePayload) => {
        if (message.notification?.title) {
          new Notification(message.notification.title, {
            body: message.notification?.body,
          });
        }
      });
    } else {
      // Need to request permissions to show notifications.
      requestNotificationsPermissions(uid);
    }
  } catch (error) {
    console.error("Unable to get messaging token.", error);
  }
}
