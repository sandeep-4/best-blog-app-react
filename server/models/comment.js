const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
    },
    authorId: String,
    authorName: String,
    postId: String,
    time: Date,
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Comment", commentSchema);
