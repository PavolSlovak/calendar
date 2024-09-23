import { Team } from "../models/team.js";
import mongoose from "mongoose";
import { Request, Response } from "express";
import { Team as TeamSchema } from "../schemas/schemas.js";
type CRequest = Request & { user: { id: string; color: string } };

export const createTeam = async (req: CRequest, res: Response) => {
  try {
    const userData = req.user;
    const teamData = req.body;
    console.log("userData", userData);

    console.log("teamData", teamData);
    /* const team = new Team({
      teamName: teamData.teamName,
      members: [new mongoose.Types.ObjectId(userData.id)],
      invitations: [...teamData.invitations],
      createdBy: new mongoose.Types.ObjectId(userData.id),
      weekSchedule: [...teamData.weekSchedule],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("team", team);
    await team.save();
    res.status(201).send(team); */
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).send("Error creating team");
  }
};
