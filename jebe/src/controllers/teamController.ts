import { Team } from "../models/team.js";
import mongoose from "mongoose";
import { Request, Response } from "express";

interface CustomRequest extends Request {
  userId?: string;
  params: {
    teamId: string;
  };
}

export const getTeams = async (req: CustomRequest, res: Response) => {
  const { teamId } = req.params;
  const { userId } = req;
  try {
    const team = await Team.findById(teamId).populate("members", "createdBy");
    if (!team) {
      return res.status(404).send("Team not found");
    } else if (
      userId &&
      !team.members.includes(new mongoose.Types.ObjectId(userId))
    ) {
      return res.status(403).send("Unauthorized");
    } else {
      return res.status(200).send(team);
    }
  } catch (error) {
    console.error("Error fetching teams:", error);
    return res.status(500).send("Internal server error");
  }
};
