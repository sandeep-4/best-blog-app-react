const User = require("../models/user");
// const jwt = require("jwt-simple");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcrypt");

const secret = process.env.JWT_SECRET;

const token = async (user) => {
  const timestamp = new Date().getTime();
  return jwt.sign({ sub: user._id, iat: timestamp }, secret, {
    expiresIn: "7d",
  });
};

function tokenSign(user) {
  const timestamp = new Date().getTime();
  return jwt.sign({ sub: user._id, iat: timestamp }, secret, {
    expiresIn: "7d",
  });
}

exports.signup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  if (!email || !password) {
    return res.status(422).send({ message: "Enter credintials" });
  }
  await User.findOne({ email }).exec((err, existingUser) => {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      res.status(401).send({ message: "User already exists" });
    }
    const newUser = new User({
      email,
      password,
      firstName,
      lastName,
    });

    console.log("before save");
    newUser
      .save()
      .then((user) => {
        console.log("here 4");
        res.json({
          message: "User saved",
          user,
        });
      })
      .catch((err) => {
        return next(err);
      });
  });
};

exports.mySignIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ message: "Enter credintials" });
  }

  await User.findOne({ email }).then((user) => {
    if (!user) {
      return res.json({ message: "Invalid credintials" });
    }
    bcrypt.compare(password, user.password).then((match) => {
      if (!match) {
        return res.json({ message: "Inavlid credintials" });
      }
      const token = token(user);
      res.json({
        token,
        username: user.firstName + " " + user.lastName,
      });
    });
  });
};

exports.signIn = async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).exec();
  if (!user) {
    res.json({ message: "Invalid credintials" });
  }
  const isMatched = bcrypt.compare(req.body.password, user.password);
  if (!isMatched) {
    if (!user) {
      res.json({ message: "Invalid credintials" });
    }
  }
  const token = tokenSign(user);

  res.send({
    token,
    username: user.firstName + " " + user.lastName,
  });
};

exports.verifyJwt = async (req, res) => {
  req.send({
    username: req.user.firstName + " " + req.user.lastName,
  });
};
