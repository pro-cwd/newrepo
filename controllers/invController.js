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
 *  Build vehicle details view
 * ************************** */
invCont.buildByVehicleDetailsId = async function (req, res, next) {
  const vehicleDetailsId = req.params.vehicleDetailsId;
  const data = await invModel.getVehicleById(vehicleDetailsId); // Assuming there's a method in invModel to fetch details by ID
  const grid = await utilities.buildVehicleDetails(data);
  let nav = await utilities.getNav();
  const className = data.classification_name;
  res.render("./inventory/vehicleDetails", {
    // Assuming you have a template for vehicle details
    title: className + " Details",
    nav,
    grid,
  });
};

/* ***************************
 *  Render management view
 * ************************** */
invCont.renderManagementView = async (req, res) => {
  let nav = await utilities.getNav();
  res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      message: req.flash("message"), 
  });
};

invCont.renderAddClassificationView = async (req, res) => {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        message: req.flash("message"),
    });
};

/* ***************************
 *  Render classification view
 * ************************** */
invCont.addNewClassification = async (req, res) => {
    const { classification_name } = req.body;

    if (!classification_name || !/^[a-zA-Z0-9]+$/.test(classification_name)) {
        req.flash("message", "Invalid classification name. Only letters and numbers allowed.");
        return res.redirect("/inv/add-classification");
    }

    const result = await invModel.insertClassification(classification_name);

    if (result) {
        req.flash("message", "Classification added successfully.");
        res.redirect("/inv/");
    } else {
        req.flash("message", "Error adding classification.");
        res.redirect("/inv/add-classification");
    }
};

/* ***************************
 * Renderizar la vista para agregar un vehículo
 * ************************** */
invCont.showAddInventoryView = async (req, res) => {
  try {
    let classificationOptions = await invModel.getClassificationOptions();
    let nav = await utilities.getNav();
    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      classificationOptions,
      errors: null,
      classification_id: "",
      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_description: "",
      inv_image: "",
      inv_thumbnail: "",
      inv_price: "",
      inv_miles: "",
      inv_color: "",
      nav,
      message: req.flash("message")
    });
  } catch (error) {
    console.error("Error loading add inventory view:", error);
    res.status(500).send("Server error");
  }
};

// Agregar un nuevo vehículo al inventario
invCont.addInventory = async (req, res) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;

  try {
    const result = await invModel.insertInventory({
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image: inv_image || "/images/no-image.png", // Imagen por defecto
      inv_thumbnail: inv_thumbnail || "/images/no-image-thumb.png",
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });

    if (result.rowCount) {
      req.flash("success", "Vehicle successfully added!");
      return res.redirect("/inv");
    } else {
      req.flash("error", "Failed to add vehicle.");
      return res.redirect("/inv/add-inventory");
    }
  } catch (error) {
    console.error("Error adding vehicle:", error);
    req.flash("error", "Server error occurred.");
    return res.redirect("/inv/add-inventory");
  }
};

module.exports = invCont;
