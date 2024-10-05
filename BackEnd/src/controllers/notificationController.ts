import sendNotif from "../config/sendNotif.js";
import User from "../models/user.js";

/* export const triggerNotification = async (req, res) => {
  try {
    let token = req.body.token;
    if (!token || typeof token !== "string") {
      throw new Error("Invalid FCM token provided");
    }
    await sendNotif(token, "Test Notification", `How are you?`);
    res.json({
      status: "success",
    });
  } catch (error) {
    console.error("Notification API error:", error.message);
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};
export const storeFcmToken = async (req, res) => {
  try {
    const fcmToken = req.body.fcmToken;
    console.log("Received FCM token:", fcmToken);
    if (!fcmToken || typeof fcmToken !== "string") {
      throw new Error("Invalid FCM token provided");
    }
    await User.findOneAndUpdate({ fcmToken: fcmToken });
  } catch (error) {
    console.error("Error storing FCM token:", error.message);
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
}; */
