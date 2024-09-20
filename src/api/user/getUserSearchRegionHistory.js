const jwt = require("jsonwebtoken");
const db = require("../../config/database");

const getUserSearchRegionHistory = async (req, res) => {
  const userToken = req.headers.authorization.split(" ")[1];

  try {
    const user = jwt.verify(userToken, process.env.JSON_SECRET);

    const { rows: currentUserHistory } = await db.query(
      "SELECT location_search_history from users WHERE id = $1",
      [user.id]
    );

    return res
      .status(200)
      .json(
        currentUserHistory[0].location_search_history.sort(
          (a, b) => b.id - a.id
        )
      );
  } catch (error) {
    return res.status(500).json({
      message: "Could extract user search history.",
    });
  }
};

module.exports = getUserSearchRegionHistory;
