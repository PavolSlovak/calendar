import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import {
  createTeamMongoDB,
  fetchTeamMongoDB,
  fetchTeamsMongoDB,
} from "../controllers/teamController.js";

const router = express.Router();

// API routes for teams
/* router.get("/:teamId", authenticateToken, getTeam); */
/* router.get("/", (req, res) => {
  res.send("GET request to the homepage");
}); */
router.post("/create", authenticateToken, createTeamMongoDB);

router.get("/", authenticateToken, fetchTeamsMongoDB);

router.get("/:teamId", authenticateToken, fetchTeamMongoDB);

export { router };
