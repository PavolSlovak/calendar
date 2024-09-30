import { Team } from "../models/team.js";
import mongoose from "mongoose";
import { Request, Response } from "express";
import { Team as TeamSchema } from "../schemas/schemas.js";
import { DecodedIdToken } from "firebase-admin/auth";
import admin from "../config/firebase.js";
import User from "../models/user.js";
type CRequest = Request & DecodedIdToken;

const generateColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const createTeam = async (req: CRequest, res: Response) => {
  try {
    const firebaseUserData = req.user;
    const teamData = req.body;

    const team = new Team({
      teamName: teamData.teamName,
      members: [
        {
          uid: firebaseUserData.uid,
          color: generateColor(),
        },
      ],

      invitations: [...teamData.invitations],
      createdBy: firebaseUserData.uid,
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
    console.log("userData", userData);
    const teams = await Team.find({ "members.uid": userData.uid });

    if (!teams) {
      console.log("No teams found");
      res.status(404).send("No teams found");
      return;
    }

    console.log("Teams fetched successfully:", teams);
    res.status(200).send(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).send("Error fetching teams");
  }
};
