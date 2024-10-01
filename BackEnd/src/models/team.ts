import mongoose from "mongoose";
import { generateColor } from "../controllers/teamController.js";

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  members: [
    {
      memberID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      firebaseID: { type: String, required: true },
      color: { type: String },
    },
  ],
  invitations: [{ type: String }],
  createdBy: {
    memberID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firebaseUID: { type: String, required: true },
  },
  weekSchedule: [
    {
      day: { type: String, enum: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
      shifts: [
        {
          memberId: { type: String, required: true },
          startTime: { type: String, required: true },
          endTime: { type: String, required: true },
        },
      ],
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
// Middleware to generate a unique color for each member
teamSchema.pre("save", function (next) {
  this.members.forEach((member) => {
    if (!member.color) {
      member.color = generateColor(); // Generate a random color
    }
  });
  next();
});
export const Team = mongoose.model("Team", teamSchema);
