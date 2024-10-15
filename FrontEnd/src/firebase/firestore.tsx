import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { addMemberToTeamInMongoDB } from "../utils/http";

export function listenForInvitationAcceptance(userId: string) {
  const invitationRef = doc(db, "invitations", userId); // Invitation document for the user

  // Listen for changes to the invitation document
  onSnapshot(invitationRef, (docSnapshot) => {
    const invitationData = docSnapshot.data();
    if (invitationData?.status === "accepted") {
      console.log("Invitation accepted by:", userId); // this should be the logged in user that was invited

      // Call a function to update MongoDB
      addMemberToTeamInMongoDB(invitationData.teamId, userId);
    }
  });
}
