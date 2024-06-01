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
        '<a href="../../inv/detail/' +
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

Util.buildVehicleDetailPage = function (vehicle) {
  let detailPage = `
    <div class="vehicle-detail-container">
      <h1>${vehicle.inv_make} ${vehicle.inv_model}</h1>
      <div class="vehicle-detail-content">
        <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${
    vehicle.inv_model
  } on CSE Motors" class="vehicle-img"/>
        <div class="vehicle-info">
          <h2>Vehicle Details</h2>
          <p><strong>Make:</strong> ${vehicle.inv_make}</p>
          <p><strong>Model:</strong> ${vehicle.inv_model}</p>
          <p><strong>Year:</strong> ${vehicle.inv_year}</p>
          <p><strong>Price:</strong> $${new Intl.NumberFormat("en-US").format(
            vehicle.inv_price
          )}</p>
          <p><strong>Mileage:</strong> ${new Intl.NumberFormat("en-US").format(
            vehicle.inv_miles
          )} miles</p>
          <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        </div>
      </div>
    </div>
  `;
  return detailPage;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
