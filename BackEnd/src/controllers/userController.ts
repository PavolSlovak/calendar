import { Request, Response } from "express";
import admin from "../config/firebase.js";

export const fetchUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const userData = await admin.auth().getUser(userId);
    res.status(200).send(userData);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("Error fetching user");
  }
};
import User from "../models/user.js"; // Import the User model

export const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    console.log("Received body:", req.body); // Log the incoming request body

    // Create a new user instance based on the incoming data
    const newUser = new User({
      firebaseUID: userData.firebaseUID,
      displayName: userData.displayName,
      email: userData.email,
      photoURL: userData.photoURL,
      role: userData.role,
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with the created user data
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user");
  }
};
