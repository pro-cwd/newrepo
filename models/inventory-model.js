const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  try {
    const data = await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    );
    return data;
  } catch (error) {
    console.error("getClassifications error: " + error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
    throw error;
  }
}

/* ***************************
 *  Get a specific vehicle by inventory ID
 * ************************** */
async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.inv_id = $1`,
      [inv_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getVehicleById error " + error);
    throw error;
  }
}

/* **************************
*  Get classification name 
* ************************** */
async function insertClassification (classification_name) {
  try {
      const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
      const { rows } = await pool.query(sql, [classification_name]);
      return rows[0];
  } catch (error) {
      console.error("Database error:", error);
      return false;
  }
};

// Insertar un nuevo vehículo en la base de datos
async function insertInventory (inventoryData) {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = inventoryData;

  const sql = `
    INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;

  const values = [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id];

  try {
    const result = await pool.query(sql, values);
    return result;
  } catch (error) {
    console.error("Error inserting inventory:", error);
    throw error;
  }
};

async function getClassificationOptions() {
  try {
    const result = await pool.query("SELECT classification_id, classification_name FROM classification");
    return result.rows || [];
  } catch (error) {
    console.error("Error retrieving classifications:", error);
    return [];
  }
}

module.exports = {
  getClassifications,
  getClassificationOptions,
  getInventoryByClassificationId,
  getVehicleById,
  insertClassification,
  insertInventory
};
