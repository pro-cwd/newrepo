const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  console.log("data aqui", data);
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
 *  Build vehicle details view
 * ************************** */
invCont.buildByVehicleDetailsId = async function (req, res, next) {
  const vehicleDetailsId = req.params.vehicleDetailsId;
  const data = await invModel.getVehicleById(vehicleDetailsId); // Assuming there's a method in invModel to fetch details by ID
  console.log("aqui data de details", data);
  const grid = await utilities.buildVehicleDetails(data);
  console.log("aqui grid de details", grid);
  let nav = await utilities.getNav();
  const className = data.classification_name;
  res.render("./inventory/vehicleDetails", {
    // Assuming you have a template for vehicle details
    title: className + " Details",
    nav,
    grid,
  });
};

module.exports = invCont;
