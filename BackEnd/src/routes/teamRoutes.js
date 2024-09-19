const express = require("express");
const authenticateToken = require("../middlewares/authenticateToken");
const router = express.Router();

// API routes for teams
router.get("/:teamId", authenticateToken, getTeams);

module.exports = router;
