import express from "express";
import sendNotif from "../config/sendNotif.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let token = "your-fcm-token-from-frontend"; // Replace with the actual FCM token
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
});
export { router };
