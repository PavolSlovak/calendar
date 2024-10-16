import express from "express";

import {
  FSCreateUser,
  FSUpdateUserFCMToken,
} from "../controllers/firestore/userController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
const router = express.Router();

router.post("/create-user", authenticateToken, FSCreateUser);

router.post("/update-user-fcm", authenticateToken, FSUpdateUserFCMToken);

export { router };
