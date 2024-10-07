import express from "express";
import sendNotif from "../config/sendNotif.js";

const router = express.Router();

router.post("/send-notifications", sendNotif);

export { router };
