const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build vehicle details
 * ************************** */
invCont.buildByVehicleDetailsId = async function (req, res, next) {
  const vehicleDetailsId = req.params.vehicleDetailsId;
  const data = await invModel.getVehicleDetailsById(vehicleDetailsId); // Assuming there's a method in invModel to fetch details by ID
  const grid = await utilities.buildVehicleDetailGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name; // Assuming classification_name is present in the data
  res.render("./inventory/vehicle-details", {
    // Assuming you have a template for vehicle details
    title: className + " Vehicle Details",
    nav,
    grid,
  });
};

module.exports = invCont;
