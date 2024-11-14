import express from "express";
import {
  FSDeleteNotification,
  FSGetNotifications,
  FSMarkNotificationRead,
  FSStoreNotification,
  sendNotif,
} from "../controllers/firestore/notificationController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

const router = express.Router();

router.post("/send-notification", authenticateToken, sendNotif);

router.post("/store-notification", authenticateToken, FSStoreNotification);

router.post(
  "/mark-notification-read",
  authenticateToken,
  FSMarkNotificationRead
);

router.post("/delete-notification", authenticateToken, FSDeleteNotification);

router.get("/get-notifications", authenticateToken, FSGetNotifications);

export { router };
