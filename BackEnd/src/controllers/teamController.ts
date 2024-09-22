import { Team } from "../models/team.js";
import mongoose from "mongoose";
import { Request, Response } from "express";
import { Team as TeamSchema } from "../schemas/schemas.js";
type CRequest = Request & { user: { id: string; color: string } };

export const findUser = async (req: Request, res: Response) => {};

export const createTeam = async (req: CRequest, res: Response) => {
  try {
    const teamData = TeamSchema.parse(req.body);

    const team = new Team({
      teamName: teamData.teamName,
      members: [new mongoose.Types.ObjectId(teamData.id)],
      invitations: teamData.invitations.map(
        (email) => new mongoose.Types.ObjectId(email)
      ),
      createdBy: new mongoose.Types.ObjectId(teamData.id),
      weekSchedule: req.body.weekSchedule,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await team.save();
    res.status(201).send(team);
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).send("Error creating team");
  }
};
