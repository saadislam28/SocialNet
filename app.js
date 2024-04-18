const express = require("express");
const postsRouter = require("./Routes/postRoute");
const userRouter = require("./Routes/userRoute");
const app = express();

app.use(express.json());

app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
