console.log("teamRoutes.js has been loaded");

import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { getTeams } from "../controllers/teamController.js";

export const router = express.Router();
// API routes for teams
router.get("/", (req, res) => {
  console.log("Hello");
  res.send("Hello");
});
router.get("/:teamId", authenticateToken, getTeams);
