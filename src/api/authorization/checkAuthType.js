const db = require("../../database");

const { AUTH_PROVIDER_CREDENTIALS } = require("../../enums/enum");
const checkIfUserExistsQuery = require("../../query/querys");

const checkAuthType = async (req, res) => {
  const { email } = req.body;
  try {
    await db.query(
      checkIfUserExistsQuery,
      [atob(email)],
      (dbError, dbResponse) => {
        if (dbError)
          res.status(500).json({ error: "Couldnt authorize user. Try again" });
        if (dbResponse.rows.length > 0) {
          if (dbResponse.rows[0].auth_provider !== AUTH_PROVIDER_CREDENTIALS)
            res.status(409).json({
              message:
                "User with this email is already registered via Google or Facebook. Please log in through those services.",
            });
          else res.status(200).json({ status: "continue" });
        } else {
          return res.status(200).json({ status: "continue" });
        }
      }
    );
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Couldnt authorize user. Try again" });
  }
};
module.exports = checkAuthType;
