const db = require("../../config/database");

const getUserSearchRegionHistory = async (req, res) => {
  const user = req.user;
  try {
    const { rows: currentUserHistory } = await db.query(
      "SELECT location_search_history from users WHERE id = $1",
      [user.id]
    );

    if (!currentUserHistory[0].location_search_history) {
      return res.status(404).json({ message: "No search history found" });
    }

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
