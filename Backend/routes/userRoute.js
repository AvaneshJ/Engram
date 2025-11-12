const express = require("express");
<<<<<<< HEAD

=======
>>>>>>> 2becc02c67e33da4ff40445add7c186124561720
const {
  registerUser,
  loginUser,
  getUsers,
} = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser); // New login route
router.get("/users", getUsers);

module.exports = router;
<<<<<<< HEAD

=======
>>>>>>> 2becc02c67e33da4ff40445add7c186124561720
