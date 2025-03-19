// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build inventory by vehicle details view
router.get(
  "/details/:vehicleDetailsId",
  utilities.handleErrors(invController.buildByVehicleDetailsId)
);

// Route to management view
router.get("/", invController.renderManagementView);

// Prute to process classifcation
router.get('/add-classification',  utilities.handleErrors(invController.renderAddClassificationView));

// Route to process the form submission
router.post("/add-classification", utilities.handleErrors(invController.addNewClassification));


// Ruta para mostrar la vista de agregar inventario
router.get("/add-inventory", invController.showAddInventoryView);

// Ruta para procesar la adición de un vehículo (con validación)
router.post("/add-inventory", invController.addInventory);



module.exports = router;
