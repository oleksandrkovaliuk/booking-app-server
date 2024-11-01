// AUTH

const checkIfUserExistsQuery = "SELECT * FROM users WHERE email = $1";
const insertUserQuery =
  "INSERT INTO users (email, password , auth_provider , role) VALUES ($1, $2 , $3 ,$4) RETURNING *;";
const insertOAuthUserQuery =
  "INSERT INTO users (email , user_name , user_lastname , img_url , auth_provider , role) VALUES ($1 , COALESCE($2, ''), COALESCE($3, ''), COALESCE($4, '') , $5 , $6) RETURNING *;";

const updateJWTQuery = "UPDATE users SET jwt = $1 WHERE id = $2 RETURNING *";
// LISTINGS

const getListingCategoriesQuery = "SELECT * FROM listings_categories";

module.exports = {
  checkIfUserExistsQuery,
  insertOAuthUserQuery,
  insertUserQuery,
  updateJWTQuery,
  getListingCategoriesQuery,
};
