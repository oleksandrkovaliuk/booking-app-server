require("dotenv").config();
const cors = require("cors");

const defaultCorsSettings = (cors.CorsOptions = {
  origin: process.env.PROD,
  methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
});

module.exports = defaultCorsSettings;
