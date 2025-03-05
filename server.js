/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const accountRoute = require("./routes/accountRoute");
const baseController = require("./controllers/baseController");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const errorRoutes = require("./routes/errorRoute");
const static = require("./routes/static");
const utilities = require("./utilities/");
const inventoryRoute = require("./routes/inventoryRoute");
const session = require("express-session");
const pool = require("./database/");

/* ***********************
 * Middleware
 * ************************/
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET || 'secreto_por_defecto',
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

// Express Messages Middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());

app.use(utilities.checkJWTToken);

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

// Añade esto en server.js antes de las rutas estáticas
app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  next();
});

/* ***********************
 * Routes
 *************************/
app.use(static);
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));
//inventory routes - unit 3, activity
// Inventory routes
app.use("/inv", inventoryRoute);
//account login
app.use("/inv/account", accountRoute);
// Error handling middleware
app.use("/error", errorRoutes);

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
  /* ***********************
   * Express Error Handler
   * Place after all other middleware
   *************************/
  app.use(async (err, req, res, next) => {
    let nav = await utilities.getNav();
    console.error(`Error at: "${req.originalUrl}": ${err.message}`);
    if (err.status == 404) {
      message = err.message;
    } else {
      message = "Oh no! There was a crash. Maybe try a different route?";
    }
    res.status(err.status || 500).render("errors/error", {
      title: err.status || "Server Error",
      message,
      nav,
    });
  });
});
/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/

const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
