console.log("Importing teamRoutes.ts");
import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { createTeam } from "../controllers/teamController.js";

const router = express.Router();

// API routes for teams
/* router.get("/:teamId", authenticateToken, getTeam); */
/* router.get("/", (req, res) => {
  res.send("GET request to the homepage");
}); */
router.post("/", authenticateToken, createTeam);

export { router };
