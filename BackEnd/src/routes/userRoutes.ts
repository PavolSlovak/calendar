import express from "express";

import {
  FSCreateUser,
  FSDeleteUser,
  FSGetUserByEmail,
  FSUpdateUserFCMToken,
  GetFSAdditionalUserData,
  GetUserAuth,
} from "../controllers/firestore/userController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
const router = express.Router();

router.post("/create-user", authenticateToken, FSCreateUser);

router.post("/update-user-fcm", authenticateToken, FSUpdateUserFCMToken);

router.delete("/delete-user/:uid", authenticateToken, FSDeleteUser);

router.get("/get-user-by-email/:email", authenticateToken, FSGetUserByEmail);

router.get("/get-user-by-uid/:uid", authenticateToken, GetUserAuth);

router.get("/get-fs-data/:uid", authenticateToken, GetFSAdditionalUserData);

export { router };
