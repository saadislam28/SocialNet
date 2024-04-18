const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const app = require("./../app");

const userRouter = express.Router();
userRouter.post("/signup", authController.SignUp);
userRouter.post("/login", authController.login);
userRouter.route("/").get(userController.getAllUsers);
userRouter
  .route("/addFriend")
  .patch(authController.protect, userController.addFreind);
userRouter.route("/:id").patch(userController.updateUser);

module.exports = userRouter;
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MDZhOTZjNTIxZTZiNGM3YzFlNGU2MSIsImlhdCI6MTcxMTcxMjYyMX0.R4M8UBzxbMeuXr8n2S-wQJvCMi96fgzvSiljK8yex0c
