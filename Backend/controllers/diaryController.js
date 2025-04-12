// controllers/diaryController.js
const Diary = require("../models/diary");

const createDiaryEntry = async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    if (!title || !content || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newEntry = new Diary({ title, content, userId });
    const savedEntry = await newEntry.save();
    res.status(201).json({ diaryEntry: savedEntry });
  } catch (error) {
    console.error("Error saving diary entry:", error);
    res.status(500).json({ error: "Failed to create diary entry" });
  }
};

const getDiaryEntries = async (req, res) => {
  try {
    const { userId } = req.params;
    const entries = await Diary.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching diary entries:", error);
    res.status(500).json({ error: "Failed to fetch diary entries" });
  }
};

module.exports = {
  createDiaryEntry,
  getDiaryEntries,
};
