const express = require("express");
const router = express.Router();
const multer = require("multer")();

const accessUser = require("../api/auth/accesUser");
const insertOAuthUser = require("../api/auth/insertOAuthUser");
const checkAuthType = require("../api/auth/checkAuthType");
const updateTokensBlackList = require("../api/auth/updateTokensBlackList");

const getUserSearchRegionHistory = require("../api/user/getUserSearchRegionHistory");
const updateUserSearchRegionHistory = require("../api/user/updateUserSearchRegionHistory");

const getListings = require("../api/listings/info/getListings");
const getSearchedListings = require("../api/listings/info/getSearchedListings");

const getListingCategories = require("../api/listings/info/getListingsCategories");
const getFullCategoriesList = require("../api/listings/info/getFullCategoriesList");
const getTypeOfPlace = require("../api/listings/info/getTypeOfPlace");
const getUserListings = require("../api/listings/info/getUserListings");
const getCurrentListing = require("../api/listings/info/getCurrentListing");

const createListing = require("../api/listings/manage/createListing");
const deleteListing = require("../api/listings/manage/deleteListing");

const deleteIndividualListingImage = require("../api/listings/images/deleteIndividualImages");
const deleteListingImages = require("../api/listings/images/deleteImages");
const uploadUserListingImages = require("../api/listings/images/uploadingImages");

const setDisabledDates = require("../api/listings/calendar/setDisabledDates");

const updateListing = require("../api/listings/update/updateListing");

// USER
const getUser = require("../api/user/getUser");

// MIDDLEWARE
const verificateToken = require("../middlewares/AuthenticateBarear");

// AUTH
router.route("/auth/accessUser").post(accessUser);
router.route("/auth/oauthUser").post(insertOAuthUser);
router.route("/auth/checkAuthType").post(checkAuthType);
router
  .route("/auth/update/tokens/blacklist")
  .get(verificateToken, updateTokensBlackList);

// USER
router.route("/user/get/:user_email/:user_name").get(getUser);
router
  .route("/user/update/search/region/history")
  .post(verificateToken, updateUserSearchRegionHistory);
router
  .route("/user/get/search/region/history")
  .get(verificateToken, getUserSearchRegionHistory);

// LISTINGS
router.route("/listings/listings").get(getListings);
router.route("/listings/searched/by/params").get(getSearchedListings);

router.route("/listings/typeofplace").get(getTypeOfPlace);

router.route("/listings/categories").get(getListingCategories);
router.route("/listings/categories/all").get(getFullCategoriesList);

router.route("/listings/get/users").get(verificateToken, getUserListings);
router.route("/listings/get/current/:id").get(getCurrentListing);

router.route("/listings/listing/create").post(verificateToken, createListing);
router.route("/listings/listing/delete").post(verificateToken, deleteListing);

// UPDATE LISTING

router.route("/listings/request/update").post(verificateToken, updateListing);

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

module.exports = router;
