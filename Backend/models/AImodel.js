const mongoose = require("mongoose");

const diarySchema = new mongoose.Schema(
  {
    dailyDiary: [
      {
        date: { type: Date, required: true },
        title: { type: String, required: true },
        content: { type: String, required: true },

        aura: {
          personality: {
            Openness: { type: String },
            Conscientiousness: { type: String },
            Extraversion: { type: String },
            Agreeableness: { type: String },
            Neuroticism: { type: String },
            Relations: { type: String },
            Others: { type: String },
          },
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Diary", diarySchema);
