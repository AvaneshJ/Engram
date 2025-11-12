// models/Accuracy.js
const mongoose = require("mongoose"); // ← import mongoose
const { Schema } = mongoose; // ← extract Schema

const AccuracySchema = new Schema({
<<<<<<< HEAD
    date: {
        type: Date,
        default: () => new Date().setHours(0, 0, 0, 0),
    },
    overallScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    breakdown: {
        openness: Number,
        conscientiousness: Number,
        extraversion: Number,
        agreeableness: Number,
        neuroticism: Number,
    },
});

module.exports = mongoose.model("Accuracy", AccuracySchema);
=======
  date: {
    type: Date,
    default: () => new Date().setHours(0, 0, 0, 0),
  },
  overallScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  breakdown: {
    openness: Number,
    conscientiousness: Number,
    extraversion: Number,
    agreeableness: Number,
    neuroticism: Number,
  },
});

module.exports = mongoose.model("Accuracy", AccuracySchema);
>>>>>>> 2becc02c67e33da4ff40445add7c186124561720
