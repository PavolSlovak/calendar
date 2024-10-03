import admin from "./firebase.js";

const sendNotif = async (token, title, body) => {
  try {
    if (!token || typeof token !== "string") {
      throw new Error("Invalid FCM token provided");
    }
    const message = {
      notification: {
        title: title,
        body: body,
      },
      android: {
        notification: {
          sound: "default",
        },
        data: {
          title: title,
          body: body,
        },
      },
      token: token,
    };
    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
  } catch (error) {
    console.error("Error sending message:", error.message);
    throw error;
  }
};
export default sendNotif;
