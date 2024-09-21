import express, { Application, Express } from "express";
import { config as dotenvConfig } from "dotenv";
import { corsMiddleware } from "./middlewares/cors.js"; // Add .js extension
import { connectDB } from "./config/db.js"; // Add .js extension
import { router as teamRoutes } from "./routes/teamRoutes.js";

if (process.env.NODE_ENV !== "production") {
  dotenvConfig();
}

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(corsMiddleware);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Routes
app.use("/teams", teamRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
