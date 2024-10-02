import { Team } from "../models/team.js";
import { Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import User from "../models/user.js";
type CRequest = Request & DecodedIdToken;

export const generateColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const createTeam = async (req: CRequest, res: Response) => {
  try {
    console.log("Received team body:", req.body);
    const team = new Team(req.body);

    await team.save();
    console.log("Team created successfully:", team);
    res.status(201).send(team);
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).send("Error creating team");
  }
};

export const fetchTeam = async (req: CRequest, res: Response) => {
  const teamId = req.params.teamId;
  const teamData = await Team.findById(teamId).populate(
    "members.memberID createdBy.memberID shifts.memberID shifts.comments "
  );

  if (!teamData) {
    console.log("No team found");
    res.status(404).send("No team found");
    return;
  }

  console.log("Team fetched successfully:", teamData);
  res.status(200).send(teamData);
};
export const fetchTeams = async (req: CRequest, res: Response) => {
  try {
    const userData = req.user;
    console.log("userData", userData);
    const teams = await Team.find({ "members.firebaseID": userData.uid });
    console.log("teams", teams);
    console.log("userData.uid", userData.uid);
    if (!teams) {
      console.error("No teams found");
      return res.status(404).send("No teams found");
    }
    // Check if the authorMongoUserId was found

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
