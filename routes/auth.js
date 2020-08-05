const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config/keys");
const auth = require("../middleware/auth");

router.post("/signup", async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !password || !name)
    return res.status(422).send({ error: "please fill required fields" });
  try {
    const userExists = await User.findOne({ email: email });
    if (userExists)
      return res.status(422).send({ error: "E-mail already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      name,
      pic,
    });
    const createdUser = await user.save();
    res.status(200).send({
      status: {
        message: "Sign-up success",
        user: createdUser,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email: bodyEmail, password } = req.body;
    if (!bodyEmail || !password)
      return res.status(422).send({ error: "please add email or password" });

    const user = await User.findOne({ email: bodyEmail });
    if (!user)
      return res.status(422).send({ error: "Invalid E-mail or Password" });

    const validPass = await bcrypt.compareSync(password, user.password);
    if (!validPass) return res.status(422).send({ error: "Invalid Login" });

    const token = await jwt.sign({ _id: user._id }, JWT_SECRET_KEY);
    const { _id, name, email, followers, following, pic } = user;
    res.status(200).send({
      status: {
        message: "Successfully signed in",
        user: { _id, name, email, followers, following, pic },
        token,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
