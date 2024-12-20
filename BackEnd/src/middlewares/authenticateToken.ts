import { Request, Response, NextFunction } from "express";
import { FirebaseAuthUser } from "@shared/schemas.js"; // Import the User interface from the index file"
import admin from "firebase-admin";
import { DecodedIdToken } from "firebase-admin/auth";

interface CustomRequest extends Request {
  user?: DecodedIdToken;
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
    if (!token) {
      return res.status(403).send("Unauthorized");
    }
    // Use Firebase Admin SDK to verify the token
    const decodedToken = await admin.auth().verifyIdToken(token);
    // Attach user info to the request object
    req.user = decodedToken;
    /* console.log(
      "Successfully authenticated user, decoded token:",
      decodedToken
    ); */
    console.log("User successfully authenticated.", decodedToken.uid);
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(403).send("Unauthorized");
  }
};
