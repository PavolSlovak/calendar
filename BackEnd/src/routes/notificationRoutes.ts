import express from "express";
import { sendNotif } from "../controllers/firebase/notificationController.js";
const router = express.Router();

router.post("/send-notification", sendNotif);

export { router };
