import express from "express";
import {
  FBStoreNotification,
  sendNotif,
} from "../controllers/firestore/notificationController.js";

const router = express.Router();

router.post("/send-notification", sendNotif);

router.post("/store-notification", FBStoreNotification);

export { router };
