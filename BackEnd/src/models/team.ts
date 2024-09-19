import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  weekSchedule: [
    {
      day: String,
      shifts: [
        {
          memberId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          startTime: String,
          endTime: String,
        },
      ],
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const Team = mongoose.model("Team", teamSchema);
export default Team;
