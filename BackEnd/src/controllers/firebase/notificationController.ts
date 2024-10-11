import admin from "firebase-admin";
import { Request, Response } from "express";

const FCM_TOKEN_COLLECTION = "fcmTokens";
export const FCM_TOKEN_KEY = "fcmToken";

const USERS_COLLECTION = "users"; // Assuming this is the main users collection
const NOTIFICATIONS_SUBCOLLECTION = "notifications"; // Subcollection for notifications

export const sendNotif = async (req: Request, res: Response) => {
  // uid is the user ID to send the notification to
  const { to, notification } = req.body;
  const documentSnapshot = await admin
    .firestore()
    .collection(FCM_TOKEN_COLLECTION)
    .doc(to)
    .get();
  const fcmToken = documentSnapshot.data()?.[FCM_TOKEN_KEY];
  if (!fcmToken) {
    console.error("FCM Token not found for user", to);
    return;
  }
  try {
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      token: fcmToken,
    };
    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
  } catch (error) {
    console.error("Error sending message:", error.message);
    throw error;
  }
};

export const FBCreateUser = async (req: Request, res: Response) => {
  const { uid, role } = req.body;
  const documentSnapshot = await admin
    .firestore()
    .collection(USERS_COLLECTION)
    .add({
      uid: uid,
      role: role,
    });
  console.log("User created with ID: ", documentSnapshot.id);
  res.status(200).send({ success: true, id: documentSnapshot.id });
};
export const FBStoreNotification = async (req: Request, res: Response) => {
  const { to, from, notification } = req.body;
  const documentSnapshot = await admin
    .firestore()
    .collection(USERS_COLLECTION)
    .doc(to)
    .collection(NOTIFICATIONS_SUBCOLLECTION)
    .add({
      from: from,
      notification: notification,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: "unread",
    });
  console.log("Notification stored with ID: ", documentSnapshot.id);
  res.status(200).send({ success: true, id: documentSnapshot.id });
};
