import admin from "firebase-admin";

const FCM_TOKEN_COLLECTION = "fcmTokens";
export const FCM_TOKEN_KEY = "fcmToken";

export const sendNotif = async (uid, title, body) => {
  // uid is the user ID to send the notification to
  const documentSnapshot = await admin
    .firestore()
    .collection(FCM_TOKEN_COLLECTION)
    .doc(uid)
    .get();
  const fcmToken = documentSnapshot.data()?.[FCM_TOKEN_KEY];
  try {
    const message = {
      notification: {
        title: title,
        body: body,
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
