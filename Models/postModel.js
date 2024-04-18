const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  post: {
    type: String,
    minlength: [1, "posts must have some characters"],
    maxlength: [100, "max length exceeded"],
  },
  user: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
});
postSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "-__v",
  });
  next();
});
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
