const jwt = require("jsonwebtoken");

const db = require("../../config/database");
const { AUTH_ROLE } = require("../../enums/enum");
const {
  checkIfUserExistsQuery,
  insertOAuthUserQuery,
} = require("../../query/querys");

const insertOAuthUser = async (req, res) => {
  const { email, user_name, user_lastname, img_url, provider } = req.body;

  try {
    if (email) {
      const existingUser = await db.query(checkIfUserExistsQuery, [email]);

      if (existingUser.rows.length > 0) {
        if (existingUser.rows[0].auth_provider === provider) {
          const token = jwt.sign(existingUser.rows[0], process.env.JSON_SECRET);

          const blackListedToken = await db.query(
            "SELECT * FROM tokens_black_list WHERE token = $1",
            [token]
          );

          if (blackListedToken.rows.length > 0) {
            const newToken = jwt.sign(
              existingUser.rows[0],
              process.env.JSON_SECRET
            );
            return res.status(200).json({
              status: "authorized",
              user: { ...existingUser.rows[0], jwt: newToken },
            });
          }

          return res.status(200).json({
            status: "authorized",
            user: { ...existingUser.rows[0], jwt: token },
          });
        } else {
          return res.status(409).json({
            message:
              "User with this email is already registered via other platform. Please log in through those services.",
          });
        }
      } else {
        const insertUser = await db.query(insertOAuthUserQuery, [
          email,
          user_name,
          user_lastname,
          img_url,
          provider,
          AUTH_ROLE,
        ]);

        if (!insertUser.rows[0]) throw new Error("Something went wrong");
        const token = jwt.sign(insertUser.rows[0], process.env.JSON_SECRET);

        const blackListedToken = await db.query(
          "SELECT * FROM tokens_black_list WHERE token = $1",
          [token]
        );

        if (blackListedToken.rows.length > 0) {
          const newToken = jwt.sign(
            insertUser.rows[0],
            process.env.JSON_SECRET
          );
          return res.status(200).json({
            status: "authorized",
            user: { ...insertUser.rows[0], jwt: newToken },
          });
        }

        return res.status(200).json({
          status: "authorized",
          user: { ...insertUser.rows[0], jwt: token },
        });
      }
    } else {
      throw Error("Failed with validate email or password");
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: error.message || "Couldnt authorize user. Try again" });
  }
};

module.exports = insertOAuthUser;
