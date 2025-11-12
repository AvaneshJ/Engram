// models/Review.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReviewSchema = new Schema({
<<<<<<< HEAD
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ratings: {
        openness: { type: Number, min: 0, max: 10, required: true },
        conscientiousness: { type: Number, min: 0, max: 10, required: true },
        extraversion: { type: Number, min: 0, max: 10, required: true },
        agreeableness: { type: Number, min: 0, max: 10, required: true },
        neuroticism: { type: Number, min: 0, max: 10, required: true },
    },
    thoughtsFeedback: { type: String },
    comments: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", ReviewSchema);
=======
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  ratings: {
    openness: { type: Number, min: 0, max: 10, required: true },
    conscientiousness: { type: Number, min: 0, max: 10, required: true },
    extraversion: { type: Number, min: 0, max: 10, required: true },
    agreeableness: { type: Number, min: 0, max: 10, required: true },
    neuroticism: { type: Number, min: 0, max: 10, required: true },
  },
  thoughtsFeedback: { type: String },
  comments: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", ReviewSchema);
>>>>>>> 2becc02c67e33da4ff40445add7c186124561720
