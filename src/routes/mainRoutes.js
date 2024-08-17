const express = require("express");
const router = express.Router();

const accessUser = require("../api/authorization/accesUser");
const insertOAuthUser = require("../api/authorization/insertOAuthUser");
const checkAuthType = require("../api/authorization/checkAuthType");

const getListingCategories = require("../api/listings/getListingsCategories");
const getTypeOfPlace = require("../api/listings/getTypeOfPlace");
const createListing = require("../api/listings/createListing");
const getListings = require("../api/listings/getListings");
const deleteListing = require("../api/listings/deleteListing");

// AUTH
router.route("/auth/accessUser").post(accessUser);
router.route("/auth/oauthUser").post(insertOAuthUser);
router.route("/auth/checkAuthType").post(checkAuthType);

// LISTINGS
router.route("/listings/listings").get(getListings);
router.route("/listings/categories").get(getListingCategories);
router.route("/listings/typeofplace").get(getTypeOfPlace);
router.route("/listings/createListing").post(createListing);
router.route("/listings/deleteListing").post(deleteListing);
module.exports = router;
