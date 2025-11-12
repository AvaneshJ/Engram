// controllers/diaryController.js
const Diary = require("../models/diary");
const Aura = require("../models/Aura");
<<<<<<< HEAD
const { fork } = require("child_process");
=======
const { spawn } = require("child_process");
>>>>>>> 2becc02c67e33da4ff40445add7c186124561720
const fs = require("fs");
const path = require("path");

/**
<<<<<<< HEAD
 * Helper that pulls all diaries, runs extractor.js, upserts Aura.
=======
 * Helper that pulls all diaries, runs extractor.py, upserts Aura.
>>>>>>> 2becc02c67e33da4ff40445add7c186124561720
 * Returns a Promise that resolves to the updated Aura doc, or rejects on error.
 */
async function updateUserAura(userId) {
  // 1️⃣ Fetch all diaries
  const diaries = await Diary.find({ userId }).sort({ createdAt: 1 });
  if (!diaries.length) throw new Error("No diaries to analyze");

  const payload = diaries.map((d) => ({ text: d.content }));

  // 2️⃣ Write temp JSON file
  const tempDir = path.join(__dirname, "../database");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
  const tempFile = path.join(tempDir, `diary_${userId}.json`);
  fs.writeFileSync(tempFile, JSON.stringify(payload, null, 2));

<<<<<<< HEAD
  // 3️⃣ Fork the Node.js extractor
  return new Promise((resolve, reject) => {
    const extractor = fork(path.join(__dirname, "../../extractor.js"), [tempFile]);
=======
  // 3️⃣ Spawn the Python extractor
  return new Promise((resolve, reject) => {
    const extractor = spawn("python3", [
      path.join(__dirname, "../../extractor.py"),
      tempFile,
    ]);
>>>>>>> 2becc02c67e33da4ff40445add7c186124561720

    let stdout = "";
    let stderr = "";

<<<<<<< HEAD
    extractor.on("message", (message) => {
      if (message.type === "stdout") {
        stdout += message.data;
      } else if (message.type === "stderr") {
        stderr += message.data;
      }
    });
=======
    extractor.stdout.on("data", (data) => (stdout += data.toString()));
    extractor.stderr.on("data", (data) => (stderr += data.toString()));
>>>>>>> 2becc02c67e33da4ff40445add7c186124561720

    extractor.on("close", async (code) => {
      if (code !== 0) {
        return reject(new Error(`Extractor exited ${code}: ${stderr}`));
      }
      let personality;
      try {
        personality = JSON.parse(stdout);
      } catch (e) {
        return reject(new Error("Invalid JSON from extractor: " + e.message));
      }

      try {
        const auraDoc = await Aura.findOneAndUpdate(
          { userId },
          { personality },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        resolve(auraDoc);
      } catch (mongoErr) {
        reject(mongoErr);
      }
    });
<<<<<<< HEAD

    extractor.on("error", (err) => {
      reject(err);
    });
=======
>>>>>>> 2becc02c67e33da4ff40445add7c186124561720
  });
}

const createDiaryEntry = async (req, res) => {
  const { title, content, userId } = req.body;
  if (!title || !content || !userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  let savedEntry;
  try {
    savedEntry = await new Diary({ title, content, userId }).save();
  } catch (err) {
    console.error("Error saving diary entry:", err);
    return res.status(500).json({ error: "Failed to create diary entry" });
  }

  // 🔥 Fire-and-forget the aura update so it can't block the response
  updateUserAura(userId)
    .then((aura) => {
      console.log("Aura successfully updated:", aura._id);
    })
    .catch((err) => {
      console.error("Failed to update aura (but diary was saved):", err);
    });

  // ✅ Respond immediately with the saved diary
  res.status(201).json({ diaryEntry: savedEntry });
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
