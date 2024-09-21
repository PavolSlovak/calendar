import { User } from "@shared/schemas.js";
import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import { DecodedIdToken } from "firebase-admin/auth";

interface CustomRequest extends Request {
  user?: User;
  userId?: string;
}
export const authenticateToken = async (
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
    req.user = decodedToken as User & DecodedIdToken;
    req.userId = decodedToken.uid;

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).send("Unauthorized");
  }
};
