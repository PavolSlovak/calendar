const express = require("express");
const router = express.Router();

// API routes for teams
router.get("/", (req, res) => {
  res.json({ message: "Teams API" });
});

module.exports = router;
