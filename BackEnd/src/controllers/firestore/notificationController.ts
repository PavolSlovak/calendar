import admin from "firebase-admin";
import { Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";

export const FCM_TOKEN_KEY = "fcmToken";

const USERS_COLLECTION = "users"; // Main users collection
const NOTIFICATIONS_SUBCOLLECTION = "notifications"; // Subcollection for notifications
type CRequest = Request & DecodedIdToken;
export const sendNotif = async (req: Request, res: Response) => {
  try {
    // to is uid of the user to send the notification to
    const { to, notification } = req.body;
    const documentSnapshot = await admin
      .firestore()
      .collection(USERS_COLLECTION)
      .doc(to)
      .get();
    const fcmToken = documentSnapshot.data()?.[FCM_TOKEN_KEY];

    if (!fcmToken) {
      console.error("FCM Token not found for user", to);
      return res.status(404).send("FCM Token not found");
    }
    console.log("fcmToken");
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      token: fcmToken,
    };
    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);

    res.status(200).send({ success: true });
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).send("Error sending message");
  }
};

export const FBStoreNotification = async (req: CRequest, res: Response) => {
  try {
    const { uid } = req.user;
    const { to, title, body } = req.body;
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    const documentSnapshot = await admin
      .firestore()
      .collection(USERS_COLLECTION)
      .doc(to)
      .collection(NOTIFICATIONS_SUBCOLLECTION)
      .add({
        from: uid,
        notification: {
          title: title,
          body: body,
        },
        timestamp: timestamp,
        status: "unread",
      });
    console.log("Notification stored with ID: ", documentSnapshot.id);

    res.status(200).send({ success: true, id: documentSnapshot.id });
  } catch (error) {
    console.error("Error storing notification:", error.message);
    res.status(500).send("Error storing notification");
  }
};
