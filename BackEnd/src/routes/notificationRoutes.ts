import express from "express";
import {
  FBStoreNotification,
  sendNotif,
} from "../controllers/firestore/notificationController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

const router = express.Router();

router.post("/send-notification", sendNotif);

router.post("/store-notification", authenticateToken, FBStoreNotification);

export { router };
