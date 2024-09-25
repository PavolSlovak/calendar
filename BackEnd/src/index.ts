import express, { Express } from "express";
import { corsMiddleware } from "./middlewares/cors.js";
import { connectDB } from "./config/db.js";
import "./config/firebase.js"; // Importing firebase admin sdk config

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();
// Middlewares
app.use(corsMiddleware);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Routes
import { router as teamRoutes } from "./routes/teamRoutes.js";
app.use("/api/teams", teamRoutes);

import { router as userRoutes } from "./routes/userRoutes.js";
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
