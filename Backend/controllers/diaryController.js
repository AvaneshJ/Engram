const Diary = require("../models/diary");

exports.createDiaryEntry = async (req, res) => {
  try {
    const { userId, title, content } = req.body;
    const diaryEntry = new Diary({ userId, title, content });
    await diaryEntry.save();
    res
      .status(201)
      .json({ message: "Diary entry created successfully!", diaryEntry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDiaryEntries = async (req, res) => {
  try {
    const { userId } = req.params;
    const diaryEntries = await Diary.find({ userId }).sort({ date: -1 }); // Sort by latest entry
    res.json(diaryEntries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
