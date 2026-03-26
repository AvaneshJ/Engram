const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const authMiddleware = require("../middleware/authmiddleware");

// 1. GET: Fetch all sessions for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Find all sessions belonging to this user, sorted newest first
    const sessions = await Session.find({ userId: req.userId }).sort({
      updatedAt: -1,
    });

    res.json({ sessions });
  } catch (err) {
    console.error("Error fetching sessions:", err);
    res.status(500).json({ error: "Failed to fetch chat history." });
  }
});

// 2. POST: Create a brand new session
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, messages, tokens } = req.body;

    const newSession = new Session({
      userId: req.userId,
      title: title || "New Chat",
      messages: messages || [],
      tokens: tokens || 0,
    });

    const savedSession = await newSession.save();
    res.status(201).json(savedSession);
  } catch (err) {
    console.error("Error creating session:", err);
    res.status(500).json({ error: "Failed to create new session." });
  }
});

// 3. PUT: Update an existing session (add messages)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { messages, tokens, title } = req.body;

    // We use findOneAndUpdate to ensure the session actually belongs to the user making the request
    const updatedSession = await Session.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        $set: {
          messages: messages, // Overwrites the array with the latest state from React
          tokens: tokens,
          ...(title && { title }), // Updates title if provided
        },
      },
      { new: true }, // Returns the newly updated document
    );

    if (!updatedSession) {
      return res
        .status(404)
        .json({ error: "Session not found or unauthorized." });
    }

    res.json(updatedSession);
  } catch (err) {
    console.error("Error updating session:", err);
    res.status(500).json({ error: "Failed to update session." });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedSessionid = await Session.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!deletedSessionid) {
      return res.status(400).json({ error: "Session not found or authorised" });
    }
    res.json({ message: "Session deleted successfully!" });
  } catch (err) {
    console.error("Error deleting session", err);
    res.status(500).json({ error: "Failed to delete session" });
  }
});

module.exports = router;
