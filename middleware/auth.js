const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config/keys");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  const header = req.header("Authorization");
  if (!header) return res.status(401).send({ error: "you must be logged in" });
  const token = header.replace("Bearer ", "");

  jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
    if (err) return res.status(400).send({ error: "you must be logged in" });
    const { _id } = payload;
    User.findById(_id).then((userData) => {
      req.user = userData;
      next();
    });
  });
};
