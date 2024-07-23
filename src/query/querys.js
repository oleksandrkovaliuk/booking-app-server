// AUTH

const checkIfUserExistsQuery = "SELECT * FROM users WHERE email = $1";

// LISTINGS

const getListingCategoriesQuery = "SELECT * FROM listings_categories";
module.exports = { checkIfUserExistsQuery, getListingCategoriesQuery };
