console.log("Importing teamRoutes.ts");
import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { getTeams } from "../controllers/teamController.js";

export const router = express.Router();

// API routes for teams
router.get("/:teamId", authenticateToken, getTeams);
router.get("/", (req, res) => {
  res.send("GET request to the homepage");
});
