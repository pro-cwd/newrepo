const express = require("express");
const path = require("path");
const router = new express.Router();

// Serve static files from the "public" directory
router.use(express.static(path.join(__dirname, "../public")));

// Serve CSS files from the correct directory
router.use(
  "/inv/type/css",
  express.static(path.join(__dirname, "../public/css"))
);
router.use("/js", express.static(path.join(__dirname, "../public/js")));
router.use("/images", express.static(path.join(__dirname, "../public/images")));

console.log("__dirname is", __dirname);
module.exports = router;
