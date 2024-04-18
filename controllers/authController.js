const User = require("./../Models/userModel");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const jwttoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};
exports.SignUp = async (req, res) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = jwttoken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
};
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new Error("enter email or password"));
  const user = await User.findOne({ email }).select("+password");
  // console.log(user);
  // console.log(user.correctPassword(password, user.password));
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new Error("incorrect email or password", 401));
  }
  const token = jwttoken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
  next();
};
exports.protect = async (req, res, next) => {
  try {
    console.log("new api hitting");
    // 1) Getting the token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    //  console.log(req.headers.authorization, "token here");
    if (!token) {
      return new Error("You are not logged in! Please log in.");
    }

    // 2) Verifying the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //   console.log(decoded, token);
    // 3) Check if the user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return new Error(
        "The user belonging to this token does no longer exist."
      );
    }
    req.userID = decoded.id;
    // 4) Check if user changed password after the token was issued

    // If all checks pass, move to the next middleware
    next();
  } catch (error) {
    // Handle errors
    res.status(404).json({
      error,
    });
  }
};
