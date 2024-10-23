import express from "express";

import {
  FSCreateUser,
  FSGetUserByEmail,
  FSGetUserByUID,
  FSUpdateUserFCMToken,
} from "../controllers/firestore/userController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
const router = express.Router();

router.post("/create-user", authenticateToken, FSCreateUser);

router.post("/update-user-fcm", authenticateToken, FSUpdateUserFCMToken);

router.get("/get-user-by-email/:email", authenticateToken, FSGetUserByEmail);

router.get("/get-user-by-uid/:uid", authenticateToken, FSGetUserByUID);
export { router };
