// accuracyService.js
const Review = require("../models/Review");
const Accuracy = require("../models/Accuracy");

<<<<<<< HEAD
console.log("Accuracy service loaded.");
async function recomputeAccuracy() {
    // 1. Fetch all reviews (or within a window: e.g. last 30 days)
    const reviews = await Review.find();
    if (!reviews.length) return;

    // 2. Average each trait
    const sum = {
        openness: 0,
        conscientiousness: 0,
        extraversion: 0,
        agreeableness: 0,
        neuroticism: 0,
    };
    reviews.forEach((r) => {
        Object.entries(r.ratings).forEach(([k, v]) => (sum[k] += v));
    });
    const count = reviews.length;
    const breakdown = Object.fromEntries(
        Object.entries(sum).map(([k, total]) => [k, +(total / count).toFixed(1)])
    );

    // 3. Compute overall score as simple mean of the five
    const overallScore = +(
        Object.values(breakdown).reduce((a, b) => a + b, 0) / 5
    ).toFixed(1);

    // 4. Upsert today’s accuracy document
    const today = new Date().setHours(0, 0, 0, 0);
    await Accuracy.findOneAndUpdate(
        { date: today },
        { overallScore, breakdown, date: today },
        { upsert: true }
    );
}

module.exports = { recomputeAccuracy };
=======
async function recomputeAccuracy() {
  // 1. Fetch all reviews (or within a window: e.g. last 30 days)
  const reviews = await Review.find();
  if (!reviews.length) return;

  // 2. Average each trait
  const sum = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0,
  };
  reviews.forEach((r) => {
    Object.entries(r.ratings).forEach(([k, v]) => (sum[k] += v));
  });
  const count = reviews.length;
  const breakdown = Object.fromEntries(
    Object.entries(sum).map(([k, total]) => [k, +(total / count).toFixed(1)])
  );

  // 3. Compute overall score as simple mean of the five
  const overallScore = +(
    Object.values(breakdown).reduce((a, b) => a + b, 0) / 5
  ).toFixed(1);

  // 4. Upsert today’s accuracy document
  const today = new Date().setHours(0, 0, 0, 0);
  await Accuracy.findOneAndUpdate(
    { date: today },
    { overallScore, breakdown, date: today },
    { upsert: true }
  );
}

module.exports = { recomputeAccuracy };
>>>>>>> 2becc02c67e33da4ff40445add7c186124561720
