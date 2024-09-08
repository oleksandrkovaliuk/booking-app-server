const express = require("express");
const router = express.Router();
const multer = require("multer")();

const accessUser = require("../api/authorization/accesUser");
const insertOAuthUser = require("../api/authorization/insertOAuthUser");
const checkAuthType = require("../api/authorization/checkAuthType");

const getListings = require("../api/listings/info/getListings");
const getVerifiedListings = require("../api/listings/info/getVerifiedListings");

const getListingCategories = require("../api/listings/info/getListingsCategories");
const getTypeOfPlace = require("../api/listings/info/getTypeOfPlace");
const getUserListings = require("../api/listings/info/getUserListings");
const getCurrentListing = require("../api/listings/info/getCurrentListing");

const createListing = require("../api/listings/manage/createListing");
const deleteListing = require("../api/listings/manage/deleteListing");

const deleteIndividualListingImage = require("../api/listings/images/deleteIndividualImages");
const deleteListingImages = require("../api/listings/images/deleteImages");
const uploadUserListingImages = require("../api/listings/images/uploadingImages");

const setDisabledDates = require("../api/listings/calendar/setDisabledDates");

const requestListingBySearchReq = require("../api/listings/searchFilters/requestListingBySearchReq");

const updateListing = require("../api/listings/update/updateListing");
const getUser = require("../api/user/getUser");

// MIDDLEWARE
const verificateToken = require("../middlewares/AuthenticateBarear");

// AUTH
router.route("/auth/accessUser").post(accessUser);
router.route("/auth/oauthUser").post(insertOAuthUser);
router.route("/auth/checkAuthType").post(checkAuthType);

// USER
router.route("/user/get/:user_email/:user_name").get(verificateToken, getUser);

// LISTINGS
router.route("/listings/verified").get(getVerifiedListings);
router.route("/listings/listings").get(getListings);
router.route("/listings/typeofplace").get(getTypeOfPlace);
router.route("/listings/categories").get(getListingCategories);

router.route("/listings/get/users").get(verificateToken, getUserListings);
router.route("/listings/get/current/:id").get(getCurrentListing);

router.route("/listings/listing/create").post(verificateToken, createListing);
router.route("/listings/listing/delete").post(verificateToken, deleteListing);

router.route("/listings/request/search").post(requestListingBySearchReq);

// IMAGES
router
  .route("/listings/images/upload")
  .post(multer.array("files"), verificateToken, uploadUserListingImages);
router
  .route("/listings/images/delete")
  .post(verificateToken, deleteListingImages);
router
  .route("/listings/images/delete/individual")
  .post(verificateToken, deleteIndividualListingImage);

// CALENDAR
router
  .route("/listings/calendar/update")
  .post(verificateToken, setDisabledDates);

// UPDATE LISTING
router.route("/listings/request/update").post(verificateToken, updateListing);

module.exports = router;
