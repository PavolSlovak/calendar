import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import {
  FSAcceptInvitation,
  FSDeclineInvitation,
  FSDeleteInvitation,
  FSGetInvitations,
  FSStoreInvitation,
} from "../controllers/firestore/invitationController.js";

const router = express.Router();

router.post("/store-invitation", authenticateToken, FSStoreInvitation);

router.get("/get-invitations", authenticateToken, FSGetInvitations);

router.post("/accept-invitation", authenticateToken, FSAcceptInvitation);

router.post("/decline-invitation", authenticateToken, FSDeclineInvitation);

router.post("/delete-invitation", authenticateToken, FSDeleteInvitation);

export { router };
