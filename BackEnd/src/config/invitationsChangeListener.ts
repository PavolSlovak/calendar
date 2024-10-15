import { addMemberMongoDB } from "../controllers/teamController.js";
import { db } from "./firebase.js";

export function listenForInvitationChanges() {
  db.collection("invitations").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      const invitationData = change.doc.data();
      const userId = change.doc.id; // Document ID is userId

      if (change.type === "modified" && invitationData.status === "accepted") {
        console.log(`Invitation accepted by user: ${userId}`);

        // Call your MongoDB update logic
        const teamId = invitationData.teamId;
        try {
          await addMemberMongoDB(teamId, userId);
          console.log(`User ${userId} added to team ${teamId} in MongoDB`);
        } catch (error) {
          console.error("Error updating MongoDB:", error);
        }
      }
    });
  });
}
