import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { fetchUser } from "../controllers/userController.js";

export const router = express.Router();

router.get("/:userId", authenticateToken, fetchUser);
