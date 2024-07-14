const cors = require("cors");

const defaultCorsSettings = (cors.CorsOptions = {
  origin: process.env.DEV ? "http://localhost:3000" : process.env.DEV,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
});

module.exports = defaultCorsSettings;
