import mongoose from "mongoose";

// Invitation schema
const invitationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  teamID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // User who sent the invitation
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined", "expired"],
    default: "pending",
  },
  token: {
    type: String, // A token for verifying/accepting the invite (e.g., JWT or random string)
    required: true,
  },
  expirationDate: {
    type: Date, // Optional expiration date for the invitation
    default: () => Date.now() + 7 * 24 * 60 * 60 * 1000, // Expires in 7 days by default
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Invitation = mongoose.model("Invitation", invitationSchema);
