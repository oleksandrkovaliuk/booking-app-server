const checkIfUserExistsQuery = "SELECT * FROM users WHERE email = $1";

module.exports = checkIfUserExistsQuery;
