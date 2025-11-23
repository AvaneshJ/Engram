const express = require("express");
const router = express.Router();
const Diary = require("../models/diary");
const {
  createDiaryEntry,
  getDiaryEntries,
} = require("../controllers/diaryController");
// Ensure this points to your actual auth middleware file
const authenticateUser = require("../middleware/authmiddleware");

// POST /api/diary/create
router.post(
  "/create",
  authenticateUser,
  (req, res, next) => {
    req.body.userId = req.userId;
    next();
  },
  createDiaryEntry
);

// GET /api/diary
router.get(
  "/",
  authenticateUser,
  (req, res, next) => {
    req.params.userId = req.userId;
    next();
  },
  getDiaryEntries
);

// --- DELETE ROUTE (FIXED) ---
router.delete("/delete/:id", authenticateUser, async (req, res) => {
  try {
    // 1. Get the ID from the URL (e.g. /delete/6743...)
    const entryId = req.params.id;
    const userId = req.userId; // From auth middleware

    // 2. Find the entry
    const diary = await Diary.findById(entryId);

    // 3. Handle if not found
    if (!diary) {
      return res.status(404).json({ error: "Not Found" });
    }

    // 4. Ownership Check: Ensure the logged-in user owns this entry
    // We convert ObjectIds to strings to compare them safely
    if (diary.userId.toString() !== userId) {
      return res.status(401).json({ error: "Not Allowed" });
    }

    // 5. Delete
    await Diary.findByIdAndDelete(entryId);

    res.json({ Success: "Entry has been deleted" });
  } catch (error) {
    console.error("💥 Server Error during delete:", error.message);
    res.status(500).send("Internal Server error");
  }
});

module.exports = router;
