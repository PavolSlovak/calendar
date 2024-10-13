import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import {
  FSAcceptInvitation,
  FSDeclineInvitation,
  FSGetInvitations,
  FSStoreInvitation,
} from "../controllers/firestore/invitationController.js";

const router = express.Router();

router.post("/store-invitation", authenticateToken, FSStoreInvitation);

router.get("/get-invitations", authenticateToken, FSGetInvitations);

router.post("/accept-invitation", authenticateToken, FSAcceptInvitation);

router.post("/delete-invitation", authenticateToken, FSDeclineInvitation);

export { router };
