import admin from "firebase-admin";
import e, { Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";

const USERS_COLLECTION = "users"; // Main users collection in Firestore
type CRequest = Request & DecodedIdToken;

export const FSCreateUser = async (req: CRequest, res: Response) => {
  const { uid } = req.user;
  const { fcmToken } = req.body;
  const timestamp = new Date().toISOString();
  await admin.firestore().collection(USERS_COLLECTION).doc(uid).set({
    fcmToken: fcmToken,
    role: "user",
    timeStamp: timestamp,
  });
  console.log(`Firestore user created for ${uid}`);
  res.status(200).send({ message: "User created" });
};
export const FSUpdateUserFCMToken = async (req: CRequest, res: Response) => {
  const { uid } = req.user;
  const { fcmToken } = req.body;
  const timestamp = new Date().toISOString();
  await admin.firestore().collection(USERS_COLLECTION).doc(uid).update({
    fcmToken: fcmToken,
    timeStamp: timestamp,
  });
  console.log(`FCM token updated for user ${uid}`);
  res.status(200).send({ message: "FCM token updated" });
};

export const FSDeleteUser = async (req: CRequest, res: Response) => {
  try {
    const { uid } = req.params;
    await admin.auth().deleteUser(uid);
    await admin.firestore().collection(USERS_COLLECTION).doc(uid).delete();
    console.log(`User ${uid} deleted`);
    res.status(200).send({ message: "User deleted" });
  } catch (error) {
    console.error("Error deleting user", error.errorInfo.message);

    res.status(500).send({
      success: false,
      message: error.errorInfo.message,
    });
  }
};
export const FSGetUserByEmail = async (req: CRequest, res: Response) => {
  try {
    const { email } = req.params;

    const user = await admin.auth().getUserByEmail(email);
    if (!user) {
      res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).send(user);
  } catch (error) {
    console.error("Error fetching user by email", error.errorInfo.message);

    res.status(500).send({
      success: false,
      message: error.errorInfo.message,
    });
  }
};
export const GetFSAdditionalUserData = async (req: CRequest, res: Response) => {
  try {
    const { uid } = req.params;

    const user = await admin
      .firestore()
      .collection(USERS_COLLECTION)
      .doc(uid)
      .get();

    if (!user) {
      res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    const userData = user.data();
    return res.status(200).send(userData);
  } catch (error) {
    console.error("Error fetching user by UID", error.errorInfo.message);

    res.status(500).send({
      success: false,
      message: error.errorInfo.message,
    });
  }
};
export const GetUserAuth = async (req: CRequest, res: Response) => {
  try {
    const { uid } = req.params;

    const user = await admin.auth().getUser(uid);
    if (!user) {
      res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).send(user);
  } catch (error) {
    console.error("Error fetching user by UID", error.errorInfo.message);

    res.status(500).send({
      success: false,
      message: error.errorInfo.message,
    });
  }
};
