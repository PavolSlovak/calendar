import admin from "firebase-admin";
import { Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { Invitation } from "@shared/schemas.js";

export const FCM_TOKEN_KEY = "fcmToken";

const USERS_COLLECTION = "users"; // Main users collection
const INVITATIONS_SUBCOLLECTION = "invitations"; // Subcollection for notifications
type CRequest = Request & DecodedIdToken;

export const FSStoreInvitation = async (req: CRequest, res: Response) => {
  try {
    console.log("JEBE");
    const { uid } = req.user;
    const { teamId, invitedUserId } = req.body;
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    const documentSnapshot = await admin
      .firestore()
      .collection(USERS_COLLECTION)
      .doc(invitedUserId)
      .collection(INVITATIONS_SUBCOLLECTION)
      .add({
        teamId: teamId,
        invitedByUserId: uid,
        status: "pending",
        timestamp: timestamp,
      });
    console.log("Notification stored with ID: ", documentSnapshot.id);

    res.status(200).send({ success: true, id: documentSnapshot.id });
  } catch (error) {
    console.error("Error storing notification:", error.message);
    res.status(500).send("Error storing notification");
  }
};
export const FSGetInvitations = async (req: CRequest, res: Response) => {
  try {
    const { uid } = req.user;
    const documentSnapshot = await admin
      .firestore()
      .collection(USERS_COLLECTION)
      .doc(uid)
      .collection(INVITATIONS_SUBCOLLECTION)
      .get();
    const invitationsList: Invitation[] = documentSnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    res.status(200).send(invitationsList);
  } catch (error) {
    console.error("Error getting notifications:", error.message);
    res.status(500).send("Error getting notifications");
  }
};
export const FSAcceptInvitation = async (req: CRequest, res: Response) => {
  try {
    const { uid } = req.user;
    const { invitationId } = req.body;
    const documentSnapshot = await admin
      .firestore()
      .collection(USERS_COLLECTION)
      .doc(uid)
      .collection(INVITATIONS_SUBCOLLECTION)
      .doc(invitationId)
      .update({ status: "accepted" });
    res.status(200).send({ success: true });
  } catch (error) {
    console.error("Error accepting invitation:", error.message);
    res.status(500).send("Error accepting invitation");
  }
};
export const FSDeclineInvitation = async (req: CRequest, res: Response) => {
  try {
    const { uid } = req.user;
    const { invitationId } = req.body;
    const documentSnapshot = await admin
      .firestore()
      .collection(USERS_COLLECTION)
      .doc(uid)
      .collection(INVITATIONS_SUBCOLLECTION)
      .doc(invitationId)
      .update({ status: "declined" });
    res.status(200).send({ success: true });
  } catch (error) {
    console.error("Error declining invitation:", error.message);
    res.status(500).send("Error declining invitation");
  }
};
export const FSDeleteInvitation = async (req: CRequest, res: Response) => {
  try {
    const { uid } = req.user;
    const { invitationId } = req.body;
    await admin
      .firestore()
      .collection(USERS_COLLECTION)
      .doc(uid)
      .collection(INVITATIONS_SUBCOLLECTION)
      .doc(invitationId)
      .delete();
    res.status(200).send({ success: true });
  } catch (error) {
    console.error("Error deleting invitation:", error.message);
    res.status(500).send("Error deleting invitation");
  }
};
