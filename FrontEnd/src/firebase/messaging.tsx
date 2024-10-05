import { getToken } from "firebase/messaging";
import { db, messaging } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

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

export async function saveMessagingDeviceToken(uid: string) {
  const msg: any = await messaging();
  const fcmToken = await getToken(msg, { vapidKey: VAPID_KEY });

  if (fcmToken) {
    console.log("FCM token:", fcmToken);
    const tokenRef = doc(db, FCM_TOKEN_COLLECTION, uid);

    await setDoc(tokenRef, { fcmToken }); // overwrites document if it already exists
  } else {
    requestNotificationsPermissions(uid);
  }
}
