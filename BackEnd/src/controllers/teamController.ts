import { Request, Response } from "express";
import mongoose from "mongoose";
import Team from "../models/team";

interface CustomRequest extends Request {
  userId?: string;
}

export const getTeams = async (req: CustomRequest, res: Response) => {
  const { teamId } = req.params;
  const { userId } = req;
  try {
    const team = await Team.findById(teamId).populate("members", "createdBy");
    if (!team) {
      return res.status(404).json("Team not found");
    } else if (
      userId &&
      !team.members.includes(new mongoose.Types.ObjectId(userId))
    ) {
      return res.status(403).json("Unauthorized");
    } else {
      return res.status(200).json(team);
    }
  } catch (error) {
    console.error("Error fetching teams:", error);
    return res.status(500).json("Internal server error");
  }
};
