const jwt = require("jsonwebtoken");
const db = require("../../config/database");
const { AUTH_PROVIDER_CREDENTIALS, AUTH_ROLE } = require("../../enums/enum");
const {
  checkIfUserExistsQuery,
  insertUserQuery,
} = require("../../query/querys");

const accessUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email && password) {
      const existingUser = await db.query(checkIfUserExistsQuery, [email]);

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
          email,
          password,
          AUTH_PROVIDER_CREDENTIALS,
          AUTH_ROLE,
        ]);

        console.log(insertedUser , "insertedUser");

        if (!insertedUser.rows[0]) throw new Error("Something went wrong");

        const token = jwt.sign(insertedUser.rows[0], process.env.JSON_SECRET);

        const blackListedToken = await db.query(
          "SELECT * FROM tokens_black_list WHERE token = $1",
          [token]
        );

        if (blackListedToken.rows.length > 0) {
          const newToken = jwt.sign(
            insertedUser.rows[0],
            process.env.JSON_SECRET
          );
          return res.status(200).json({
            status: "authorized",
            user: { ...insertedUser.rows[0], jwt: newToken },
          });
        }

        return res.status(200).json({
          status: "authorized",
          user: { ...insertedUser.rows[0], jwt: token },
        });
      }
    } else {
      throw Error("Failed with validate email or password");
    }
  } catch (error) {
    console.log(error, "error");
    return res
      .status(500)
      .json({ error: error.message || "Couldnt authorize user. Try again" });
  }
};
module.exports = accessUser;
