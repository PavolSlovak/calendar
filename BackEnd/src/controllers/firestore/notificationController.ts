import admin from "firebase-admin";
import { Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { Notification } from "@shared/schemas.js";

export const FCM_TOKEN_KEY = "fcmToken";

const USERS_COLLECTION = "users"; // Main users collection
const NOTIFICATIONS_SUBCOLLECTION = "notifications"; // Subcollection for notifications
type CRequest = Request & DecodedIdToken;

export const sendNotif = async (req: Request, res: Response) => {
  try {
    // to is uid of the user to send the notification to
    const { to, title, body } = req.body;
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
        title: title,
        body: body,
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

export const FSStoreNotification = async (req: CRequest, res: Response) => {
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
export const FSGetNotifications = async (req: CRequest, res: Response) => {
  try {
    const { uid } = req.user;
    const notifications = await admin
      .firestore()
      .collection(USERS_COLLECTION)
      .doc(uid)
      .collection(NOTIFICATIONS_SUBCOLLECTION)
      .orderBy("timestamp", "desc")
      .get();
    const notificationsList: Notification[] = [];
    notifications.forEach((doc) => {
      notificationsList.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    res.status(200).send(notificationsList);
  } catch (error) {
    console.error("Error getting notifications:", error.message);
    res.status(500).send("Error getting notifications");
  }
};
export const FSDeleteNotification = async (req: CRequest, res: Response) => {
  try {
    const { uid } = req.user;
    const { notificationId } = req.body;
    await admin
      .firestore()
      .collection(USERS_COLLECTION)
      .doc(uid)
      .collection(NOTIFICATIONS_SUBCOLLECTION)
      .doc(notificationId)
      .delete();
    res.status(200).send({ success: true });
  } catch (error) {
    console.error("Error deleting notification:", error.message);
    res.status(500).send("Error deleting notification");
  }
};
export const FSMarkNotificationRead = async (req: CRequest, res: Response) => {
  try {
    const { uid } = req.user;
    const { notificationId } = req.body;
    await admin
      .firestore()
      .collection(USERS_COLLECTION)
      .doc(uid)
      .collection(NOTIFICATIONS_SUBCOLLECTION)
      .doc(notificationId)
      .update({ status: "read" });
    res.status(200).send({ success: true });
  } catch (error) {
    console.error("Error marking notification read:", error.message);
    res.status(500).send("Error marking notification read");
  }
};
