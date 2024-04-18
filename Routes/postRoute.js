const express = require("express");
const postController = require("./../controllers/postsController");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const app = require("./../app");
const postsRouter = express.Router();
postsRouter
  .route("/")
  .get(authController.protect, postController.getPosts)
  .post(authController.protect, postController.createPosts);
postsRouter
  .route("/:id")
  .patch(postController.updatePosts)
  .delete(authController.protect, postController.deletePosts);
module.exports = postsRouter;
