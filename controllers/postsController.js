const Post = require("./../Models/postModel");
exports.getPosts = async (req, res) => {
  const post = await Post.find();
  res.status(200).json({
    status: "success",
    data: post,
  });
};
exports.createPosts = async (req, res) => {
  const post = await Post.create(req.body);
  res.status(200).json({
    status: "success",
    data: post,
  });
};
exports.updatePosts = async (req, res) => {
  try {
    const updatePost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: updatePost,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
exports.deletePosts = async (req, res) => {
  const deletepost = await Post.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    data: null,
  });
};
