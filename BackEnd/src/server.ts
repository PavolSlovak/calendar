if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const corsMiddleware = require("./middlewares/cors");
const connectToDB = require("./config/db");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectToDB();

// Middlewares
app.use(corsMiddleware);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Routes
const teamRoutes = require("./controllers/teamController");
app.use("/teams", teamRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
