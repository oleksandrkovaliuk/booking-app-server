const express = require("express");
const router = express.Router();
const multer = require("multer")();

const accessUser = require("../api/authorization/accesUser");
const insertOAuthUser = require("../api/authorization/insertOAuthUser");
const checkAuthType = require("../api/authorization/checkAuthType");

const getListings = require("../api/listings/info/getListings");
const getListingCategories = require("../api/listings/info/getListingsCategories");
const getTypeOfPlace = require("../api/listings/info/getTypeOfPlace");

const createListing = require("../api/listings/manage/createListing");
const deleteListing = require("../api/listings/manage/deleteListing");

const deleteIndividualListingImage = require("../api/listings/images/deleteIndividualImages");
const deleteListingImages = require("../api/listings/images/deleteImages");
const uploadUserListingImages = require("../api/listings/images/uploadingImages");

const setDisabledDates = require("../api/listings/calendar/setDisabledDates");

const updateListing = require("../api/listings/update/updateListing");
const getUser = require("../api/user/getUser");

// AUTH
router.route("/auth/accessUser").post(accessUser);
router.route("/auth/oauthUser").post(insertOAuthUser);
router.route("/auth/checkAuthType").post(checkAuthType);

// USER
router.route("/user/get/:user_email/:user_name").get(getUser);

// LISTINGS
router.route("/listings/listings").get(getListings);
router.route("/listings/categories").get(getListingCategories);
router.route("/listings/typeofplace").get(getTypeOfPlace);
router.route("/listings/createListing").post(createListing);
router.route("/listings/deleteListing").post(deleteListing);

// IMAGES
router
  .route("/listings/images/upload")
  .post(multer.array("files"), uploadUserListingImages);
router.route("/listings/images/delete").post(deleteListingImages);
router
  .route("/listings/images/deleteIndividual")
  .post(deleteIndividualListingImage);

// CALENDAR
router.route("/listings/calendar/confirm").post(setDisabledDates);

// UPDATE LISTING
router.route("/listings/update").post(updateListing);

module.exports = router;
