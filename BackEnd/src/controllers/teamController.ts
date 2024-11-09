import { Team } from "../models/team.js";
import { Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { Shift } from "../models/shift.js";

type CRequest = Request & DecodedIdToken;

export const generateColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const createTeamMongoDB = async (req: CRequest, res: Response) => {
  try {
    const { name, invitations } = req.body;
    const { uid } = req.user;
    console.log("Received team body:", req.body, uid);
    const team = new Team({
      teamName: name,
      members: [
        // add the creator as a member
        {
          firebaseID: uid,
        },
      ],
      createdBy: uid,
      invitations: invitations,
    });
    const alreadyExists = await Team.findOne({ teamName: name });

    if (alreadyExists) {
      console.log("Team already exists");
      res.status(400).send("Team already exists");
      return;
    }

    await team.save();
    console.log("Team created successfully:", team);
    res.status(201).send(team);
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).send("Error creating team");
  }
};
export const createShiftMongoDB = async (req: CRequest, res: Response) => {
  const { memberID, teamID, startTime, endTime, date, recurrence } = req.body;
  console.log("Received shift body:", req.body);
  // save the shift to the MongoDB
  const shift = new Shift({
    memberID,
    teamID,
    startTime,
    endTime,
    date,
    recurrence,
  });
  await shift.save();
  console.log("Shift created successfully:", shift);

  // find the team by the teamId
  console.log("teamId", teamID);
  const team = await Team.findById(teamID);
  if (!team) {
    console.error("Team not found");
    res.status(404).send("Team not found");
    return;
  }
  // add shift id to the team shifts
  team.shifts.push(shift._id);
  await team.save();

  console.log("Shift created successfully:", shift);
  res.status(201).send(shift);
};

export const fetchTeamMongoDB = async (req: CRequest, res: Response) => {
  const teamId = req.params.teamId;
  const teamData = await Team.findById(teamId).populate(
    "createdBy.memberID members.memberID shifts.memberID"
  );

  if (!teamData) {
    console.log("No team found");
    res.status(404).send("No team found");
    return;
  }

  console.log("Team fetched successfully:", teamData);
  res.status(200).send(teamData);
};
export const fetchTeamsMongoDB = async (req: CRequest, res: Response) => {
  try {
    const userData = req.user;
    console.log("userData", userData);
    const teams = await Team.find({ "members.firebaseID": userData.uid });

    if (!teams) {
      console.error("No teams found");
      return res.status(404).send("No teams found");
    }

    console.log("Teams fetched successfully:", teams);
    res.status(200).send(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).send("Error fetching teams");
  }
};
export const deleteTeamMongoDB = async (req: CRequest, res: Response) => {
  const teamId = req.params.teamId;
  const team = await Team.findByIdAndDelete(teamId);

  if (!team) {
    console.error("Team not found");
    res.status(404).send("Team not found");
    return;
  }

  console.log("Team deleted successfully:", team);
  res.status(200).send(team);
};
// Gets triggered when a user accepts an invitation
export const addMemberMongoDB = async (teamId: string, userId: string) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw new Error("Team not found");
  }
  team.members.push({ firebaseID: userId });
  await team.save();
};
