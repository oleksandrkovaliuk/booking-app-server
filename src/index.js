require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const mainRouters = require("./routes/mainRoutes");
const defaultCorsSettings = require("./barear/corsSettings");
const dbClientConnection = require("./database");

const app = express();
const PORT = process.env.PORT;
const setupRoutes = () => {
  app.use(cors(defaultCorsSettings));
  app.use("/api", mainRouters);
  app.use(function (req, res, next) {
    next(createError(404));
  });
  app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.render("error");
  });
};
const setupMiddlewares = () => {
  app.use(logger("dev"));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));

  app.use(express.urlencoded({ extended: false })); // default true

  app.use(express.json({ limit: "10mb" }));
};

const setupDataBase = async () => await dbClientConnection.connect();

async function init() {
  try {
    setupMiddlewares();
    await setupDataBase();
    setupRoutes();

    app.listen(PORT, () => {
      return console.log(`Server is listening on ${PORT}`);
    });
  } catch (error) {
    throw new Error(`Could not init application: ${error}`);
  }
}

init();

module.exports = app;
