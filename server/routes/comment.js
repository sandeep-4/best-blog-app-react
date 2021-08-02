const Blog = require("../controllers/blog");

const express = require("express");
const router = express.Router(); // service
const passport = require("passport");
const passportService = require("../utils/passport");

// middleware in between Incoming Request and Route Handler
const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

router.post("/comments/:postId", requireAuth, Blog.createComment);
router.get("/comments/:postId", Blog.fetchCommentByPostId);

module.exports = router;
