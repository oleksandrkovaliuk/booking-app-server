const express = require("express");
const router = express.Router();
const multer = require("multer")();

const accessUser = require("../api/auth/accesUser");
const insertOAuthUser = require("../api/auth/insertOAuthUser");
const checkAuthType = require("../api/auth/checkAuthType");
const updateTokensBlackList = require("../api/auth/updateTokensBlackList");

const getListings = require("../api/listings/info/getListings");
const getSearchedListings = require("../api/listings/info/getSearchedListings");

const getTypeOfPlace = require("../api/listings/info/getTypeOfPlace");
const getUserListings = require("../api/listings/info/getUserListings");
const getListingCategories = require("../api/listings/info/getListingsCategories");
const getCurrentListing = require("../api/listings/info/getCurrentListing");
const getFullCategoriesList = require("../api/listings/info/getFullCategoriesList");

const createListing = require("../api/listings/manage/createListing");
const deleteListing = require("../api/listings/manage/deleteListing");

const deleteListingImages = require("../api/listings/images/deleteImages");
const uploadUserListingImages = require("../api/listings/images/uploadingImages");
const deleteIndividualListingImage = require("../api/listings/images/deleteIndividualImages");

const setDisabledDates = require("../api/listings/calendar/setDisabledDates");
const setRangeOfDisabledDates = require("../api/listings/calendar/setRangeOfDisabledDates");

const updateListing = require("../api/listings/update/updateListing");

// USER
const getUser = require("../api/user/getUser");
const getUserNotifications = require("../api/user/notifications/getUserNotifications");
const updateUserReservations = require("../api/user/updateUserReservations");
const getUserSearchRegionHistory = require("../api/user/getUserSearchRegionHistory");
const updateUserSearchRegionHistory = require("../api/user/updateUserSearchRegionHistory");
const updateAllUserNotifications = require("../api/user/notifications/updateAllUserNotifications");

// MIDDLEWARE
const verificateToken = require("../middlewares/AuthenticateBarear");

// PAYMENT
const getClientSecret = require("../api/payment/getClientSecret");
const proccesPayment = require("../api/payment/proccesPayment");

// CHATS
const newChatMessage = require("../api/chats/newChatMessage");
const getUsersChats = require("../api/chats/getUsersChats");
const getCurrentChat = require("../api/chats/getCurrentChat");

// AUTH
router.route("/auth/accessUser").post(accessUser);
router.route("/auth/oauthUser").post(insertOAuthUser);
router.route("/auth/checkAuthType").post(checkAuthType);
router
  .route("/auth/update/tokens/blacklist")
  .get(verificateToken, updateTokensBlackList);

// USER
router.route("/user/get/:user_email").get(getUser);
router
  .route("/user/get/search/region/history")
  .get(verificateToken, getUserSearchRegionHistory);
router
  .route("/user/update/search/region/history")
  .post(verificateToken, updateUserSearchRegionHistory);
router
  .route("/user/update/reservations")
  .post(verificateToken, updateUserReservations);
router
  .route("/user/extract/notifications")
  .get(verificateToken, getUserNotifications);
router
  .route("/user/update/all/notifications")
  .patch(verificateToken, updateAllUserNotifications);

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

router
  .route("/listings/calendar/set/range/of/disabledDates")
  .post(verificateToken, setRangeOfDisabledDates);

// PAYMENT
router.route("/payment/get/clientSecret").get(verificateToken, getClientSecret);
router.route("/payment/procces").post(verificateToken, proccesPayment);

// CHATS
router.route("/chats/get/users").get(verificateToken, getUsersChats);
router.route("/chats/get/current").get(verificateToken, getCurrentChat);
router.route("/chats/new/message").post(verificateToken, newChatMessage);

module.exports = router;
