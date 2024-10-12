import admin from "firebase-admin";
import { Request, Response } from "express";

const USERS_COLLECTION = "users"; // Main users collection
const NOTIFICATIONS_SUBCOLLECTION = "notifications"; // Subcollection for notifications

export const sendNotif = async (req: Request, res: Response) => {
  try {
    // to is uid of the user to send the notification to
    const { to, notification } = req.body;
    const querySnapshot = await admin
      .firestore()
      .collection(USERS_COLLECTION)
      .where("uid", "==", to)
      .get();
    // Check if we found any documents
    if (querySnapshot.empty) {
      console.error("No user found with UID:", to);
      return res.status(404).send("User not found");
    }

    // Get the first document from the snapshot
    const userDoc = querySnapshot.docs[0];
    const fcmToken = userDoc.data()?.fcmToken; // Access the fcmToken

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

export const FBStoreNotification = async (req: Request, res: Response) => {
  try {
    const { to, from, notification } = req.body;
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    const documentSnapshot = await admin
      .firestore()
      .collection(USERS_COLLECTION)
      .doc(to)
      .collection(NOTIFICATIONS_SUBCOLLECTION)
      .add({
        from: from,
        notification: notification,
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
