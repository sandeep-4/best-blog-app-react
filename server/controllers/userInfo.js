const User = require("../models/user");
const Comment = require("../models/comment");
const Post = require("../models/post");

exports.fetchProfile = async (req, res) => {
  const user = {
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    birthday: req.user.birthday,
    phone: req.user.phone,
    sex: req.user.sex,
    address: req.user.address,
    occupation: req.user.occupation,
    description: req.user.description,
  };
  res.send({
    user,
  });
};

exports.updateProfile = async (req, res, next) => {
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const birthday = req.body.birthday;
  const phone = req.body.phone;
  const sex = req.body.sex;
  const address = req.body.address;
  const occupation = req.body.occupation;
  const description = req.body.description;

  const user = req.user;
  await Post.updateMany(
    {
      authorId: user._id,
    },
    { $set: { authorName: firstName + " " + lastName } },
    (err) => {
      if (err) {
        return next(err);
      }
    }
  );

  await Comment.updateMany(
    {
      authorId: user._id,
    },
    { $set: { authorName: firstName + " " + lastName } },
    (err) => {
      if (err) {
        return next(err);
      }
    }
  );

  await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        firstName: firstName,
        lastName: lastName,
        birthday: birthday,
        phone: phone,
        sex: sex,
        address: address,
        occupation: occupation,
        description: description,
      },
    },
    { new: true },
    async (err, updatedUser) => {
      if (err) {
        return next(err);
      }
      updatedUser = updatedUser.toObject();
      delete updatedUser["_id"];
      delete updatedUser["password"];
      delete updatedUser["__v"];
      res.send({ user: updatedUser });
    }
  );
};

exports.resetPassword = async (req, res, next) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const user = req.user;
  user.comparePassword(oldPassword, async (err, isMatch) => {
    if (err) {
      return next(err);
    }
    if (!isMatch) {
      return res.status(422).json({
        message: "Old password dint match",
      });
    }
    if (oldPassword === newPassword) {
      return res.status(422).json({
        message: "Old password dint match",
      });
    }

    user.password = newPassword;
    user.save(async (err) => {
      if (err) {
        return next(err);
      }
      res.json({ message: "Password updated" });
    });
  });
};
