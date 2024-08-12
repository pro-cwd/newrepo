// Needed resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

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
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

module.exports = router;
