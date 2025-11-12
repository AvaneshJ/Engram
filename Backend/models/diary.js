// models/Diary.js
<<<<<<< HEAD
console.log("this works");
=======
>>>>>>> 2becc02c67e33da4ff40445add7c186124561720
const mongoose = require("mongoose");

const diarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Diary", diarySchema);
<<<<<<< HEAD

console.log("this works");
=======
>>>>>>> 2becc02c67e33da4ff40445add7c186124561720
