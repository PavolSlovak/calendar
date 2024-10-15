import { getToken, MessagePayload, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

// Requests permissions to show notifications.
async function requestNotificationsPermissions(uid: string) {
  console.log("Requesting notifications permission...");
  const permission = await Notification.requestPermission();
  console.log(permission); // "granted", "denied", or "default"

  if (permission === "granted") {
    console.log("Notification permission granted.");
    // Notification permission granted.
    await getMessagingDeviceToken(uid);
  } else {
    console.log("Unable to get permission to notify.");
  }
}

// Saves the messaging device token to Cloud Firestore.
export async function getMessagingDeviceToken(uid: string) {
  try {
    const msg: any = await messaging();
    const fcmToken = await getToken(msg, { vapidKey: VAPID_KEY });
    if (fcmToken) {
      console.log("Got FCM device token:", fcmToken);
      return fcmToken;
    } else {
      // Need to request permissions to show notifications.
      requestNotificationsPermissions(uid);
    }
  } catch (error) {
    console.error("Unable to get messaging token.", error);
  }
}

export async function initializeNotificationListener() {
  // When the app is in the background, firebase-messaging-sw.js will receive the message instead.
  const msg: any = await messaging();

  onMessage(msg, (message: MessagePayload) => {
    console.log("Message received. ", message);

    if (message.notification?.title) {
      new Notification(message.notification.title, {
        body: message.notification?.body,
      });
    }
  });
}
