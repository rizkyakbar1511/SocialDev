const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Post = mongoose.model("Post");

router.get("/allposts", auth, async (req, res) => {
  try {
    //second arguments in the populate func is what u are going to show in the response postedBy
    const posts = await Post.find()
      .populate("postedBy", "_id name pic")
      .populate("comments.postedBy", "_id name")
      .sort("-createdAt");
    res.status(200).send({ status: { message: "Success", posts } });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

router.get("/getsubpost", auth, async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: { $in: [req.user.following] } })
      .populate("postedBy", "_id name")
      .populate("comments.postedBy", "_id name")
      .sort("-createdAt");
    res.status(200).send({ status: { message: "Success", posts } });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

router.post("/createpost", auth, async (req, res) => {
  const { title, body, pic } = req.body;
  if (!title || !body || !pic)
    return res.status(422).send({ error: "please fill required fields" });
  try {
    req.user.password = undefined;
    const post = new Post({
      title,
      body,
      photo: pic,
      postedBy: req.user,
    });
    const postResult = await post.save();
    res.status(200).send({
      status: {
        message: "Post Created Successfully",
        post: postResult,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

router.get("/mypost", auth, async (req, res) => {
  try {
    const myPost = await Post.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "_id name"
    );
    if (myPost.length === 0)
      return res.status(404).send({
        error: "Oops, you didn't had any post yet, lets create one !",
      });
    res.status(200).send({ status: { message: "success", myPost } });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

router.put("/like", auth, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) return res.status(422).send({ error: err });
    res.status(200).send(result);
  });
});

router.put("/unlike", auth, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) return res.status(422).send({ error: err });
    res.status(200).send(result);
  });
});

router.put("/comment", auth, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) return res.status(422).send({ error: err });
      res.status(200).send(result);
    });
});

router.delete("/deletepost/:postId", auth, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        res.status(422).send({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.status(200).send(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

module.exports = router;
