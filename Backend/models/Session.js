// models/Session.js
const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Links the session to the logged-in user
    },
    title: {
      type: String,
      default: "New Chat",
    },
    tokens: {
      type: Number,
      default: 0,
    },
    messages: [
      {
        role: { type: String, enum: ["user", "assistant"] },
        content: String,
      },
    ],
  },
  { timestamps: true },
); // Automatically handles createdAt and updatedAt

module.exports = mongoose.model("Session", sessionSchema);
