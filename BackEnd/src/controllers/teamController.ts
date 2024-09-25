import { Team } from "../models/team.js";
import mongoose from "mongoose";
import { Request, Response } from "express";
import { Team as TeamSchema } from "../schemas/schemas.js";
import { DecodedIdToken } from "firebase-admin/auth";
import admin from "../config/firebase.js";
type CRequest = Request & DecodedIdToken;

export const createTeam = async (req: CRequest, res: Response) => {
  try {
    const userData = req.user;
    const teamData = req.body;
    console.log("userData", userData);

    console.log("teamData", teamData);
    const team = new Team({
      teamName: teamData.teamName,
      members: [userData.uid],
      invitations: [...teamData.invitations],
      createdBy: userData.uid,
      weekSchedule: [...teamData.weekSchedule],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await team.save();
    console.log("Team created successfully:", team);
    res.status(201).send(team);
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).send("Error creating team");
  }
};

export const fetchTeams = async (req: CRequest, res: Response) => {
  try {
    const userData = req.user;
    const teams = await Team.find({ members: userData.uid }).populate(
      "members"
    );

    console.log("Teams fetched successfully:", teams);
    res.status(200).send(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).send("Error fetching teams");
  }
};
export const fetchMembers = async (req: Request, res: Response) => {
  const teamId = req.params.teamId;
  console.log("teamId", teamId);
  try {
    const team = await Team.findById(teamId);
    const membersData = await Promise.all(
      team.members.map(async (memberId) => {
        const userData = await admin.auth().getUser(memberId);
        return userData;
      })
    );

    res.status(200).send(membersData);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).send("Error fetching members");
  }
};
