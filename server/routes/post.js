const Blog = require("../controllers/blog");

const express = require("express");
const router = express.Router(); // service
const passport = require("passport");
const passportService = require("../utils/passport");

// middleware in between Incoming Request and Route Handler
const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

//controllers
const { createPosts, fetchPost } = require("../controllers/blog");

router.get("/", Blog.fetchPosts);
router.post("/posts", requireAuth, createPosts);
router.get("/posts/:id", fetchPost);
router.get("/allow_edit_or_delete/:id", requireAuth, Blog.allowUpdateOrDelete);
router.put("/posts/:id", requireAuth, Blog.updatePost);
router.delete("/posts/:id", requireAuth, Blog.deletePost);
router.get("/my_posts", requireAuth, Blog.fetchPostByAuthorId);

module.exports = router;
