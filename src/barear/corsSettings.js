require("dotenv").config();
const cors = require("cors");

const defaultCorsSettings = (cors.CorsOptions = {
  origin: process.env.PROD ? process.env.PROD : "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
});

module.exports = defaultCorsSettings;
