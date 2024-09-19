import "express";
import authenticateToken from "../middlewares/authenticateToken";
import { getTeams } from "../controllers/teamController";
const router = express.Router();

// API routes for teams
router.get("/:teamId", authenticateToken, getTeams);

module.exports = router;
