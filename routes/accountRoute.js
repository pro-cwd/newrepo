// Needed resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

/* *********************
 * Deliver login view
 * Unit 4, deliver login view activity
 * ********************* */
router.get("/login", utilities.handleErrors(accountController.buildLogin));

/* *********************
 * Deliver login view
 * Unit 4, deliver login view activity
 * ********************* */
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

/* *********************
 * enable the registration route
 ************************ */
router.post(
  "/register",
  utilities.handleErrors(accountController.registerAccount)
);
module.exports = router;
