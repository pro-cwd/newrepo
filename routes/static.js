const express = require("express");
const path = require("path");
const router = new express.Router();

// Serve static files from the "public" directory
router.use(express.static(path.join(__dirname, "../public")));

// Serve CSS files from the correct directory

const routes = ["type", "details"];

routes.forEach((route) => {
  router.use(
    `/inv/${route}/css`,
    express.static(path.join(__dirname, "../public/css"))
  );
  router.use(
    `/inv/${route}/js`,
    express.static(path.join(__dirname, "../public/js"))
  );
  router.use(
    `/inv/${route}/images`,
    express.static(path.join(__dirname, "../public/images"))
  );
});

module.exports = router;
