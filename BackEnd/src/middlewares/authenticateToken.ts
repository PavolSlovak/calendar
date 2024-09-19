import { Request, Response, NextFunction } from "express";

import { User } from "../../../shared/schemas";

const admin = require("firebase-admin");

type CustomRequest = Request & { user: User; userId: string };

const authenticateToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    console.log(token);
    if (!token) {
      return res.status(401).send("Unauthorized");
    }
    // Use Firebase Admin SDK to verify the token
    const decodedToken = await admin.auth().verifyIdToken(token);
    // Attach user info to the request object
    req.user = decodedToken;
    req.userId = decodedToken.uid;

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).send("Unauthorized");
  }
};
module.exports = authenticateToken;
