const db = require("../../database");
const Passwordvalidation = require("../../validation/passwordValidation");
const { AUTH_PROVIDER_CREDENTIALS, AUTH_ROLE } = require("../../enums/enum");
const { checkIfUserExistsQuery } = require("../../query/querys");

const insertUserQuery =
  "INSERT INTO users (email, password , auth_provider , role) VALUES ($1, $2 , $3 ,$4) RETURNING *;";

const accessUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email && password) {
      await db.query(
        checkIfUserExistsQuery,
        [atob(email)],
        async (dbError, dbResponse) => {
          if (!dbError && dbResponse.rows.length > 0) {
            if (atob(dbResponse.rows[0].password) === atob(password)) {
              return res.status(200).json({
                status: "authorized",
                user: dbResponse.rows[0],
              });
            } else {
              return res.status(401).json({
                message: "Your password is incorrect. Please try again",
              });
            }
          } else {
            if (!Passwordvalidation(atob(password)))
              return res.status(422).json({
                message:
                  "Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character. Please try again",
              });
            await db.query(
              insertUserQuery,
              [atob(email), password, AUTH_PROVIDER_CREDENTIALS, AUTH_ROLE],
              (dbInsertErr, dbInsertResponse) => {
                console.log(dbInsertErr, AUTH_ROLE, "entered into db 2");
                if (!dbInsertErr) {
                  console.log("user created");
                  return res.status(200).json({
                    status: "authorized",
                    user: dbInsertResponse.rows[0],
                  });
                } else {
                  console.log("error created");
                  return res
                    .status(500)
                    .json({ message: "Couldnt create user. Try again" });
                }
              }
            );
          }
        }
      );
    } else {
      throw Error("Failed with validate email or password");
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Couldnt authorize user. Try again" });
  }
};
module.exports = accessUser;
