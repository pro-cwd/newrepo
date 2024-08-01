const invModel = require("../models/inventory-model");
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
        '<a href="../../inv/detail/' +
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

module.exports = Util;
