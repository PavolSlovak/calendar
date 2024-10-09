import admin from "firebase-admin";
import { Request, Response } from "express";

const FCM_TOKEN_COLLECTION = "fcmTokens";
export const FCM_TOKEN_KEY = "fcmToken";

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
export default sendNotif;
