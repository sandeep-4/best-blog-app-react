const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    categories: [String],
    content: String,
    authorId: String,
    authorName: String,
    time: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
