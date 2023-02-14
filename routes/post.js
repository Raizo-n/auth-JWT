const router = require("express").Router();
const { publicPosts, privatePosts } = require("../db/post");
const JWT = require("jsonwebtoken");
const checkJWT = require("../middleware/checkJWT");

// API for the airticle which anyone can access
router.get("/public", (req, res) => {
  res.send(publicPosts);
});

// API for the airticle which the person who only has JWT
router.get("/private", checkJWT, (req, res) => {
  res.send(privatePosts);
});

module.exports = router;
