import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import {
  createShiftMongoDB,
  createTeamMongoDB,
  deleteTeamMongoDB,
  fetchTeamMongoDB,
  fetchTeamsMongoDB,
} from "../controllers/teamController.js";

const router = express.Router();
// Teams
router.post("/create", authenticateToken, createTeamMongoDB);

router.get("/", authenticateToken, fetchTeamsMongoDB);

router.get("/:teamId", authenticateToken, fetchTeamMongoDB);

router.delete("/:teamId", authenticateToken, deleteTeamMongoDB);
// Shifts
router.post("/create-shift", authenticateToken, createShiftMongoDB);

export { router };
