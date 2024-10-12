import admin from "firebase-admin";
import { Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";

const USERS_COLLECTION = "users"; // Main users collection in Firestore
type CRequest = Request & DecodedIdToken;

export const FSCreateUser = async (req: CRequest, res: Response) => {
  const { uid } = req.user;
  const { fcmToken } = req.body;
  const timestamp = admin.firestore.FieldValue.serverTimestamp();

  await admin.firestore().collection(USERS_COLLECTION).doc(uid).set({
    fcmToken: fcmToken,
    timeStamp: timestamp,
    role: "user",
  });
  console.log(`Firestore user created for ${uid}`);
  res.status(200).send({ success: true });
};
export const FSUpdateUserFCMToken = async (req: CRequest, res: Response) => {
  const { uid } = req.user;
  const { fcmToken } = req.body;
  const timestamp = admin.firestore.FieldValue.serverTimestamp();

  await admin.firestore().collection(USERS_COLLECTION).doc(uid).update({
    fcmToken: fcmToken,
    timeStamp: timestamp,
  });
  console.log(`FCM token updated for user ${uid}`);
  res.status(200).send({ success: true });
};
