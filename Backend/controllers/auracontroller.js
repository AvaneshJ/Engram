<<<<<<< HEAD
const { fork } = require("child_process");
const path = require("path");
const Diary = require("../models/diary");
const Aura = require("../models/Aura");
console.log("woopdi");
=======
const { spawn } = require("child_process");
const path = require("path");
const Diary = require("../models/diary");
const Aura = require("../models/Aura");
>>>>>>> 2becc02c67e33da4ff40445add7c186124561720

const updateAura = async (req, res) => {
  console.log("✅ Hit /api/aura/update");

  try {
    // 1️⃣ Fetch all diary entries for the user
    const diaries = await Diary.find({ userId: req.userId }).sort({
      createdAt: 1,
    });
    if (!diaries.length) {
      console.log("❌ No diaries found");
      return res.status(400).json({ error: "No diary entries to analyze." });
    }

    const payload = diaries.map((d) => ({ text: d.content }));

<<<<<<< HEAD
    // 2️⃣ Prepare JavaScript extractor path
    const extractorPath = path.join(__dirname, "../TextExtraction/Extractor");
    console.log("🚀 Spawning extractor file with:", extractorPath);

    // 3️⃣ Spawn the Node.js process using fork
    const extractorProcess = fork(extractorPath);
=======
    // 2️⃣ Prepare Python extractor path
    const extractorPath = path.join(
      __dirname,
      "../TextExtraction/Extractor.py"
    );
    console.log("🚀 Spawning Python with:", extractorPath);

    // 3️⃣ Spawn the Python process using stdin
    const py = spawn("python", [extractorPath], {
      stdio: ["pipe", "pipe", "pipe"],
    });
>>>>>>> 2becc02c67e33da4ff40445add7c186124561720

    let stdout = "";
    let stderr = "";

<<<<<<< HEAD
    // Send diary content to the extractor process
    extractorProcess.send({ payload });

    extractorProcess.on("message", (message) => {
      if (message.error) {
        stderr += message.error;
        console.error("🐛 Extractor error:", message.error);
      } else if (message.result) {
        stdout += JSON.stringify(message.result);
        console.log("📤 Extractor result:", message.result);
      }
    });

    extractorProcess.on("error", (err) => {
      console.error("❌ Extractor process error:", err);
      return res.status(500).json({ error: "Failed to start extractor script." });
    });

    extractorProcess.on("close", async (code) => {
      console.log("🔚 Extractor process exited with code:", code);
      if (code !== 0) {
        return res.status(500).json({
          error: "Extractor failed",
=======
    // Send diary content to Python via stdin
    py.stdin.write(JSON.stringify(payload));
    py.stdin.end();

    py.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
      console.log("🐍 Python stdout:", chunk.toString());
    });

    py.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
      console.error("🐛 Python stderr:", chunk.toString());
    });

    py.on("error", (err) => {
      console.error("❌ Python process error:", err);
      return res.status(500).json({ error: "Failed to start Python script." });
    });

    py.on("close", async (code) => {
      console.log("🔚 Python process exited with code:", code);
      if (code !== 0) {
        return res.status(500).json({
          error: "Python extractor failed",
>>>>>>> 2becc02c67e33da4ff40445add7c186124561720
          details: stderr,
        });
      }

      let personality;
      try {
        personality = JSON.parse(stdout);
      } catch (err) {
        console.error("❌ JSON parse error:", err);
        return res.status(500).json({
<<<<<<< HEAD
          error: "Invalid JSON from extractor",
=======
          error: "Invalid JSON from Python extractor",
>>>>>>> 2becc02c67e33da4ff40445add7c186124561720
          raw: stdout,
        });
      }

      // 4️⃣ Save or update the user's aura
      try {
        const auraDoc = await Aura.findOneAndUpdate(
          { userId: req.userId },
          { personality },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        console.log("✅ Aura updated:", auraDoc._id);
        return res.status(200).json(auraDoc);
      } catch (err) {
        console.error("❌ MongoDB Aura save error:", err);
        return res.status(500).json({ error: "Failed to save aura" });
      }
    });
  } catch (err) {
    console.error("❌ updateAura error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { updateAura };
