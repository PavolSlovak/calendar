import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  members: [{ type: String }],
  invitations: [{ type: String }],
  createdBy: String,
  weekSchedule: [
    {
      day: { type: String, enum: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
      shifts: [
        {
          memberId: String,
          startTime: String,
          endTime: String,
        },
      ],
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
export const Team = mongoose.model("Team", teamSchema);
