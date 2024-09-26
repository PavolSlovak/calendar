import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { createUser, fetchUser } from "../controllers/userController.js";

export const router = express.Router();

router.post("/", createUser);

router.get("/:userId", authenticateToken, fetchUser);
