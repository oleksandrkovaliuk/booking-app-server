const jwt = require("jsonwebtoken");
const db = require("../../config/database");
const Passwordvalidation = require("../../validation/passwordValidation");
const { AUTH_PROVIDER_CREDENTIALS, AUTH_ROLE } = require("../../enums/enum");
const {
  checkIfUserExistsQuery,
  insertUserQuery,
  updateJWTQuery,
} = require("../../query/querys");

const accessUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email && password) {
      const existingUser = await db.query(checkIfUserExistsQuery, [
        atob(email),
      ]);

      if (existingUser.rows.length > 0) {
        if (atob(existingUser.rows[0].password) === atob(password)) {
          const token = jwt.sign(existingUser.rows[0], process.env.JSON_SECRET);

          return res.status(200).json({
            status: "authorized",
            user: { ...existingUser.rows[0], jwt: token },
          });
        } else {
          return res.status(401).json({
            message: "Your password is incorrect. Please try again",
          });
        }
      } else {
        const insertedUser = await db.query(insertUserQuery, [
          atob(email),
          password,
          AUTH_PROVIDER_CREDENTIALS,
          AUTH_ROLE,
        ]);

        if (!insertedUser.rows[0]) throw new Error("Something went wrong");
        const token = jwt.sign(insertedUser.rows[0], process.env.JSON_SECRET);

        return res.status(200).json({
          status: "authorized",
          user: { ...insertedUser.rows[0], jwt: token },
        });
      }
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
