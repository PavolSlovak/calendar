import mongoose from "mongoose";
import { generateColor } from "../controllers/teamController.js";
import "./shift.js";

const memberSchema = new mongoose.Schema({
  firebaseID: { type: String, required: true },
  color: { type: String },
});

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true, unique: true },
  members: [memberSchema],
  invitations: [{ type: String }],
  createdBy: { type: String, required: true },
  shifts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shift" }],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
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
