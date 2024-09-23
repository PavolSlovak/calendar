import { Request, Response } from "express";
import admin from "../config/firebase.js";

type CRequest = Request & { params: { userId: string } };

export const fetchUser = async (req: CRequest, res: Response) => {
  try {
    const userId = req.params.userId;
    const userData = await admin.auth().getUser(userId);
    res.status(200).send(userData);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("Error fetching user");
  }
};
