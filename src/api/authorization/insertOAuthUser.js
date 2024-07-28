const db = require("../../database");
const { AUTH_ROLE } = require("../../enums/enum");
const { checkIfUserExistsQuery } = require("../../query/querys");

const insertOAuthUserQuery =
  "INSERT INTO users (email , user_name , user_lastname , img_url , auth_provider , role) VALUES ($1 , COALESCE($2, ''), COALESCE($3, ''), COALESCE($4, '') , $5 , $6) RETURNING *;";

const insertOAuthUser = async (req, res) => {
  const { email, user_name, user_lastname, img_url, provider } = req.body;

  try {
    if (email) {
      await db.query(
        checkIfUserExistsQuery,
        [email],
        async (dbError, dbResponse) => {
          if (!dbError && dbResponse.rows.length > 0) {
            if (dbResponse.rows[0].auth_provider === provider) {
              return res.status(200).json({
                status: "authorized",
                role: dbResponse.rows[0].role,
              });
            } else {
              return res.status(409).json({
                message:
                  "User with this email is already registered via other platform. Please log in through those services.",
              });
            }
          } else {
            await db.query(
              insertOAuthUserQuery,
              [email, user_name, user_lastname, img_url, provider, AUTH_ROLE],
              (dbError, dbResponse) => {
                if (!dbError)
                  res.status(200).json({
                    status: "authorized",
                    role: dbResponse.rows[0].role,
                  });
                else
                  res.status(500).json({
                    message: "Couldnt authroize user . Please try again",
                  });
              }
            );
          }
        }
      );
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Couldnt authorize user. Try again" });
  }
};

module.exports = insertOAuthUser;