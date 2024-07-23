const express = require("express");
const router = express.Router();

const accessUser = require("../api/authorization/accesUser");
const insertOAuthUser = require("../api/authorization/insertOAuthUser");
const checkAuthType = require("../api/authorization/checkAuthType");

const getListingCategories = require("../api/listings/getListingsCategories");

// AUTH
router.route("/auth/accessUser").post(accessUser);
router.route("/auth/oauthUser").post(insertOAuthUser);
router.route("/auth/checkAuthType").post(checkAuthType);

// LISTINGS
router.route("/listings/categories").get(getListingCategories);
module.exports = router;
