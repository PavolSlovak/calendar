import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import {
  createShiftMongoDB,
  createTeamMongoDB,
  fetchTeamMongoDB,
  fetchTeamsMongoDB,
} from "../controllers/teamController.js";

const router = express.Router();
// Teams
router.post("/create", authenticateToken, createTeamMongoDB);

router.get("/", authenticateToken, fetchTeamsMongoDB);

router.get("/:teamId", authenticateToken, fetchTeamMongoDB);

// Shifts
router.post("/create-shift", authenticateToken, createShiftMongoDB);

export { router };
