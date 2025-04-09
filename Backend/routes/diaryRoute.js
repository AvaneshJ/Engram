// routes/diaryRoute.js
const express = require("express");
const {
  createDiaryEntry,
  getDiaryEntries,
} = require("../controllers/diaryController");
const router = express.Router();

// Replace with your actual test user ID
const TEST_USER_ID = "67f68c50aa5b3ce5811a9382";

// POST /api/diary/create
// Inject test userId, then call controller
router.post(
  "/create",
  (req, res, next) => {
    req.body.userId = TEST_USER_ID;
    next();
  },
  createDiaryEntry
);

// GET /api/diary
// Serve GET /api/diary (no param) and inject test userId
router.get(
  "/",
  (req, res, next) => {
    req.params.userId = TEST_USER_ID;
    next();
  },
  getDiaryEntries
);

module.exports = router;
