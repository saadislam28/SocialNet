const User = require("./../Models/userModel");
exports.getAllUsers = async (req, res) => {
  const user = await User.find();
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};
// // // exports.CreateUser = async (req, res) => {
// // //   // const user = await User.create(req.body);
// // //   res.status(200).json({
// // //     status: "success",
// // //     data: {
// // //       user,
// // //     },
// // //   });
// // // };
const filterObj = function (obj, ...allowedFields) {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.addFreind = async (req, res, next) => {
  try {
    console.log("Entered here");
    const { freindID } = req.body;
    const user = await User.findById(req.userID);
    const freind = await User.findById(freindID);
    console.log(freindID, "i am here ", freind);
    if (!freind) {
      return res.status(404).json({
        message: "Freind does not exists",
      });
    }
    const isRequestRecieved = user.receivedRequests.find((item) => {
      return item == freindID;
    });
    console.log("heheh", isRequestRecieved);
    if (isRequestRecieved) {
      console.log("Entered here receieved");
      await User.updateOne(
        { _id: req.userID },
        { $push: { friends: freindID } }
      );
      await User.updateOne(
        { _id: freindID },
        { $push: { friends: req.userID } }
      );
      await User.updateOne(
        { _id: req.userID },
        { $pull: { receivedRequests: freindID } }
      );
      await User.updateOne(
        {
          _id: freindID,
        },
        {
          $pull: { sentRequests: req.userID },
        }
      );
      return res.status(200).json({
        message: "Freind added",
      });
    }
    return res.status(200).json({
      message: "Freind not added",
    });
  } catch (err) {
    return res.status(404).json({
      message: err.message,
    });
  }
};
exports.updateUser = async (req, res, next) => {
  try {
    if (req.body.password) throw new Error("Password cannot be updated here");

    const allowedReq = filterObj(
      req.body,
      "name",
      "email",
      "sentRequests",
      "receivedRequests",
      "friendRequestStatus"
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      allowedReq,
      {
        new: true,
        runValidators: true,
      }
    );

    if (req.body.sentRequests) {
      await Promise.all([
        User.updateMany(
          { _id: { $in: req.body.sentRequests } },
          { $push: { receivedRequests: updatedUser._id } }
        ),
      ]);
    }

    res.status(200).json({
      status: "success",
      data: {
        updatedUser,
      },
    });
    next();
  } catch (err) {
    return next(err);
  }
};
