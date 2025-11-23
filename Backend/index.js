require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoute");
const diaryRoutes = require("./routes/diaryRoute");
const auraRoutes = require("./routes/auraRoute");
const reviewRoutes = require("./routes/review");
const accuracyRoutes = require("./routes/accuracy");
const chatRoutes = require("./routes/chat");

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/diary", diaryRoutes);
app.use("/api/aura", auraRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/accuracy", accuracyRoutes);
app.use("/api/chat", chatRoutes);

const PORT = 5000;
app.listen(PORT);
