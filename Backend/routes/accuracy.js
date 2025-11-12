// routes/accuracy.js
const express = require("express");
const router = express.Router();
const Accuracy = require("../models/Accuracy");
const authenticateUser = require("../middleware/authmiddleware");

// GET /api/accuracy
router.get("/", authenticateUser, async (req, res) => {
<<<<<<< HEAD
    // Return latest entry
    const latest = await Accuracy.findOne().sort({ date: -1 });
    res.json(latest || { overallScore: 0, breakdown: {} });
});

module.exports = router;
=======
  // Return latest entry
  const latest = await Accuracy.findOne().sort({ date: -1 });
  res.json(latest || { overallScore: 0, breakdown: {} });
});

module.exports = router;
>>>>>>> 2becc02c67e33da4ff40445add7c186124561720
