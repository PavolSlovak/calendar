import express, { Express } from "express";
import { corsMiddleware } from "./middlewares/cors.js";
import { config as dotenvConfig } from "dotenv";
import { connectDB } from "./config/db.js";
import "./config/firebase.js";

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();
if (process.env.NODE_ENV !== "production") {
  dotenvConfig();
}
// Listen for invitation changes in Firestore
listenForInvitationChanges();

// Middlewares

app.use(corsMiddleware);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Routes
import { router as teamRoutes } from "./routes/teamRoutes.js";
app.use("/api/teams", teamRoutes);

import { router as userRoutes } from "./routes/userRoutes.js";
app.use("/api/users", userRoutes);

import { router as notificationRoutes } from "./routes/notificationRoutes.js";
app.use("/api/notifications", notificationRoutes);

import { router as invitationRoutes } from "./routes/invitationRoutes.js";
import { listenForInvitationChanges } from "./config/invitationsChangeListener.js";
app.use("/api/invitations", invitationRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
