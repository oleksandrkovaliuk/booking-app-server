const express = require("express");
const router = express.Router();

const accessUser = require("../api/authorization/accesUser");

router.route("/auth/accessUser").post(accessUser);
module.exports = router;
