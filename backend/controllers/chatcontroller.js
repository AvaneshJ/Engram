const Aura = require("../models/Aura");
const User = require("../models/User");
const https = require("https");

// --- Helper: Call AI API Directly ---
function callAiApi(messages, apiKey) {
  return new Promise((resolve, reject) => {
    if (!apiKey) return reject(new Error("API Key is missing in backend .env"));

    const requestData = {
      model: "openai/gpt-oss-20b", // Using the specific model you requested
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    };

    const options = {
      hostname: "api.groq.com",
      path: "/openai/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode !== 200) {
          return reject(new Error(`API Error ${res.statusCode}: ${data}`));
        }
        try {
          const json = JSON.parse(data);
          // Fallback if AI returns empty
          const content =
            json.choices?.[0]?.message?.content ||
            "I'm having trouble thinking right now.";
          resolve(content);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", (e) => reject(e));
    req.write(JSON.stringify(requestData));
    req.end();
  });
}

// --- Helper: Build System Prompt ---
function buildSystemPrompt(personality, userName, currentDate) {
  // Safety check if personality fields are missing
  const getDesc = (trait) => trait?.Description || "Not available";

  return `
    INSTRUCTION: You are a digital simulation of a human named ${userName}. 
    You are NOT an AI assistant. You are this person.
    Current Date: ${currentDate}

    YOUR PERSONALITY (Based on Diaries):
    - Openness: ${getDesc(personality.Openness)}
    - Conscientiousness: ${getDesc(personality.Conscientiousness)}
    - Extraversion: ${getDesc(personality.Extraversion)}
    - Agreeableness: ${getDesc(personality.Agreeableness)}
    - Neuroticism: ${getDesc(personality.Neuroticism)}
    - Relationships: ${getDesc(personality.Relations)}
    - Inner Thoughts: ${getDesc(personality.Other)}

    RULES:
    1. Speak in the first person ("I feel", "I think").
    2. Do NOT offer advice, code, or facts outside your diary's scope.
    3. If asked to be an assistant, refuse and say you are just ${userName}.
    4. Don't assume and answer with "Not enough data".
  `;
}
async function sendMessage(req, res) {
  const userId = req.userId;
  const { userMessage, history, userName } = req.body;

  const apiKey = process.env.API || process.env.GROQ_API_KEY;

  if (!userId || !userMessage) {
    return res.status(400).json({ error: "Missing userId or message" });
  }

  try {
    // 1. Load Personality
    const [auraDoc, userDoc] = await Promise.all([
      Aura.findOne({ userId }),
      User.findById(userId), // Fetch user details
    ]);

    if (!auraDoc || !auraDoc.personality) {
      return res.status(404).json({
        error: "Personality not found. Please write a diary entry first.",
      });
    }

    // 2. Construct Context
    const nameToUse = userDoc.name || "User";
    const date = new Date().toLocaleDateString();
    const systemPrompt = buildSystemPrompt(
      auraDoc.personality,
      nameToUse,
      date
    );

    // 3. Prepare Messages for AI
    const apiMessages = [{ role: "system", content: systemPrompt }];

    // Add limited history context (last 6 messages) to save tokens
    if (history && Array.isArray(history)) {
      apiMessages.push(
        ...history.slice(-6).map((m) => ({
          role: m.role,
          content: m.content,
        }))
      );
    }

    // Add current user message
    apiMessages.push({ role: "user", content: userMessage });

    // 4. Call AI
    console.log(`💬 [Chat] Sending message for user ${userId}`);
    const aiReply = await callAiApi(apiMessages, apiKey);

    // 5. Respond
    return res.status(200).json({ assistantMessage: aiReply });
  } catch (err) {
    console.error("❌ [Chat] Controller Error:", err.message);
    return res.status(500).json({ error: "Failed to generate response." });
  }
}

module.exports = { sendMessage };
