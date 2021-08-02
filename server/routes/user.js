const express = require("express");
const router = express.Router();
const passport = require("passport");
const passportUtils = require("../utils/passport");

//middleware
const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignIn = passport.authenticate("local", { session: false });

//controllers
const { signup, signIn, verifyJwt } = require("../controllers/authentication");
const {
  fetchProfile,
  updateProfile,
  resetPassword,
} = require("../controllers/userInfo");

router.get("/secret", requireAuth, (req, res) => {
  res.send({ message: "secret ho hai" });
});

router.post("/signup", signup);
router.post("/signin", requireSignIn, signIn);
router.get("/verify_jwt", requireAuth, verifyJwt);

//profile
router.get("/profile", requireAuth, fetchProfile);
router.put("/profile", requireAuth, updateProfile);
router.get("/password", requireAuth, resetPassword);

module.exports = router;
