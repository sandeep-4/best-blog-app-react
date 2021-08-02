const Post = require("../models/post");
const Comment = require("../models/comment");

const _ = require("lodash");

exports.fetchPosts = async (req, res) => {
  await Post.find({})
    .select({})
    .limit(100)
    .sort({
      time: -1,
    })
    .exec(async (err, posts) => {
      if (err) {
        return res.status(422).json({
          message: "....... Posts ......",
        });
      }
      res.json(posts);
    });
};

exports.createPosts = async (req, res) => {
  const user = req.user;
  const title = req.body.title;
  const categories = req.body.categories;
  const content = req.body.content;
  const authorId = user._id;
  const authorName = user.firstName + " " + user.lastName;
  const time = Date.now();

  if (!title || !categories || !content) {
    res.status(401).json({
      message: "Fill properly",
    });
  }

  //creat post for user
  const post = new Post({
    title,
    categories: _.uniq(categories.split(",").map((item) => item.trim())),
    content,
    authorId,
    authorName,
    time,
  });
  post.save(async (err, post) => {
    if (err) {
      return next(err);
    }
    res.json(post);
  });
};

exports.fetchPost = async (req, res) => {
  await Post.findById({ _id: req.params.id }).exec(async (err, post) => {
    if (err) {
      return res.status(422).json({
        message: "No posts found",
      });
    }
    if (!post) {
      return res.status(422).json({
        message: "No posts found",
      });
    }
    res.json(post);
  });
};

exports.allowUpdateOrDelete = async (req, res) => {
  const user = req.user;
  await Post.findById({ _id: req.params.id }).exec((err, post) => {
    if (err) {
      return res.status(422).json({
        message: "No posts found",
      });
    }
    if (!post) {
      return res.status(422).json({
        message: "No posts found",
      });
    }
    if (!user._id.equals(post.authorId)) {
      return res.send({ allowChange: false });
    }
    res.send({ allowChange: true });
  });
};

exports.updatePost = async (req, res, next) => {
  const user = req.user;
  await Post.findById({ _id: req.params.id }).exec(async (err, post) => {
    if (err) {
      return res.status(422).json({
        message: "No posts found",
      });
    }
    if (!post) {
      return res.status(422).json({
        message: "No posts found",
      });
    }
    if (!user._id.equals(post.authorId)) {
      return res.send({ message: "Acess denied" });
    }
    const title = req.body.title;
    const categories = req.body.categories;
    const context = req.body.context;

    if (!title || !categories || !content) {
      res.status(401).json({
        message: "Fill properly",
      });
    }

    //update
    post.title = title;
    post.categories = _.uniq(categories.split(",").map((item) => item.trim()));
    post.context = context;

    post.save(async (err, post) => {
      if (err) {
        return next(err);
      }
      res.json(post);
    });
  });
};

exports.deletePost = async (req, res, next) => {
  await Post.findByIdAndRemove(req.params.id, async (err, post) => {
    if (err) {
      return next(err);
    }
    if (!post) {
      return res.status(422).json({
        message: "No posts found",
      });
    }
    await Comment.remove({ postId: post._id }, async (err) => {
      if (err) {
        return next(err);
      }
    });

    return res.json({
      message: "Deleted",
    });
  });
};

exports.fetchPostByAuthorId = async (req, res) => {
  const user = req.user;
  await Post.find({ authorId: user._id })
    .select({})
    .limit(100)
    .sort({ time: -1 })
    .exec(async (err, posts) => {
      if (err) {
        res.status(400).json({
          meessage: "No posts",
        });
      }
      res.json(posts);
    });
};

exports.createComment = async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(422).json({
      message: "No user found",
    });
  }
  const postId = req.params.postId;
  const content = req.body.content;
  if (!content) {
    return res.status(422).json({
      message: "No content found",
    });
  }
  const comment = new Comment({
    content: content,
    authorId: user._id,
    authorName: user.firstName + " " + user.lastName,
    postId: postId,
    time: Date.now(),
  });

  comment.save((err, comment) => {
    if (err) {
      return next(err);
    }
    res.json(comment);
  });
};

exports.fetchCommentByPostId = async (req, res, next) => {
  await Comment.find({ postId: req.params.postId })
    .select({})
    .limit(100)
    .sort({ time: 1 })
    .exec(async (err, comments) => {
      if (err) {
        res.status(422).json({
          message: "Cant find comment",
        });
      }
      res.json(comments);
    });
};
