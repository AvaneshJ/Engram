require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const checkDatabaseConnection = require("./middleware/dbconnection");
const userRoutes = require("./routes/userRoute");
const diaryRoutes = require("./routes/diaryRoute");
const auraRoutes = require("./routes/auraRoute");
const reviewRoutes = require("./routes/review");
const accuracyRoutes = require("./routes/accuracy");
const chatRoutes = require("./routes/chat");
const sessionRoutes = require("./routes/sessionRoute");
const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Mongoose connection options for production/serverless
const mongooseOptions = {
  maxPoolSize: 5,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  bufferCommands: false,
  retryWrites: true,
};

// Connect to MongoDB first, then start server
mongoose
  .connect(process.env.MONGO_URI, mongooseOptions)
  .then(() => {
    console.log("✅ MongoDB connected");
    startServer();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Simple route to check if the server is alive
app.get("/", (req, res) => {
  res.status(200).json({ message: "Engram API is running successfully! 🚀" });
});

// Apply database connection check to all API routes
app.use("/api", checkDatabaseConnection);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/diary", diaryRoutes);
app.use("/api/aura", auraRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/accuracy", accuracyRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

// Handle connection events
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

function startServer() {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
