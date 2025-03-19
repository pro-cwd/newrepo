const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul class='nav'>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display" class="grid-container">';
    data.forEach((vehicle) => {
      grid += "<li class='grid-item'>";
      grid +=
        '<a href="/inv/details/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" class="vehicle-img"/></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/details/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span class='vehicle-price'>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the vehicle detail view HTML
 * ************************************ */

Util.buildVehicleDetails = async function (vehicle) {
  let details;

  if (vehicle) {
    details = '<div id="vehicle-details" class="details-container">';
    details += '<div class="vehicle-left">';
    details += '<div class="vehicle-image">';
    details +=
      '<img src="' +
      vehicle.inv_image +
      '" alt="Image of ' +
      vehicle.inv_make +
      " " +
      vehicle.inv_model +
      ' on CSE Motors" class="vehicle-img"/>';
    details += "</div>";
    details += "</div>";
    details += '<div class="vehicle-right">';
    details +=
      "<h1 class='vehicle-title'>" +
      vehicle.inv_year +
      " " +
      vehicle.inv_make +
      " " +
      vehicle.inv_model +
      "</h1>";
    details += '<div class="vehicle-info">';
    details += "<ul>";
    details +=
      "<li class='vehicle-price'><strong>Price:</strong> $" +
      new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
      "</li>";
    details +=
      "<li class='vehicle-description'><strong>Description:</strong> " +
      vehicle.inv_description +
      "</li>";
    details +=
      "<li class='vehicle-color'><strong>Color:</strong> " +
      vehicle.inv_color +
      "</li>";
    details +=
      "<li class='vehicle-miles'><strong>Miles:</strong> " +
      vehicle.inv_miles +
      "</li>";
    details += "</ul>";
    details += "</div>";
    details += "</div>";
    details += "</div>";
  } else {
    details = '<p class="notice">Sorry, no vehicle details could be found.</p>';
  }

  return details;
};

/* **************************************
 * login
 * ************************************** */

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */

Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ***************************
* midlaware classification
******* */
Util.classificationValidation = (req, res, next) => {
  const { classification_name } = req.body;
  if (!classification_name || !/^[a-zA-Z0-9]+$/.test(classification_name)) {
      req.flash("message", "Invalid classification name.");
      return res.redirect("/inv/add-classification");
  }
  next();
};

 Util.validateInventory = function () {
    return [
      body("inv_make").notEmpty().withMessage("Make is required"),
      body("inv_model").notEmpty().withMessage("Model is required"),
      body("inv_year")
        .isInt({ min: 1886, max: new Date().getFullYear() })
        .withMessage(`Year must be between 1886 and ${new Date().getFullYear()}`),
      body("inv_price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
      body("inv_miles").isInt({ min: 0 }).withMessage("Miles must be a positive integer"),
      body("inv_color").notEmpty().withMessage("Color is required"),
      body("classification_id").isInt().withMessage("Valid classification is required"),

      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          req.flash("error", errors.array().map((err) => err.msg).join(" | "));
          return res.redirect("/inv/add-inventory");
        }
        next();
      },
    ];
  }

module.exports = Util;
