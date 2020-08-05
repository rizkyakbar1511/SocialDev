const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get("/user/:id", auth, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).send({ error: err });
          }
          res.status(200).send({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).send({ error: "User not found" });
    });
});

router.put("/followers", auth, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) return res.status(422).send({ error: err });
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).send({ error: err });
        });
    }
  );
});

router.put("/unfollow", auth, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user_id },
    },
    { new: true },
    (err, result) => {
      if (err) return res.status(422).send({ error: err });
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).send({ error: err });
        });
    }
  );
});

router.put("/updatepic", auth, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { pic: req.body.pic } },
    { new: true },
    (err, result) => {
      if (err) return res.status(422).send({ error: "Photo cannot change" });
      res.status(200).send(result);
    }
  );
});

router.post("/search-users", (req, res) => {
  let userPattern = new RegExp("^" + req.body.query);
  User.find({ email: { $regex: userPattern } })
    .select("_id name email")
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
