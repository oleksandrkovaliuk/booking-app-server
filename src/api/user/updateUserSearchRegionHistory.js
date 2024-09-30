const db = require("../../config/database");

const updateUserSearchRegionHistory = async (req, res) => {
  const { id, requestedAt, region, formattedValue } = req.body;

  try {
    const user = req.user;

    const { rows: currentUserHistory } = await db.query(
      "SELECT location_search_history from users WHERE id = $1",
      [user.id]
    );

    const filteredCurrentUserHistory = currentUserHistory[0]
      .location_search_history
      ? currentUserHistory[0].location_search_history.filter(
          (el) => el.formattedValue !== formattedValue
        )
      : [];

    if (filteredCurrentUserHistory.length >= 5) {
      filteredCurrentUserHistory.shift();
    }

    await db.query(
      "UPDATE users SET location_search_history = $1 WHERE id = $2",
      [
        JSON.stringify([
          ...filteredCurrentUserHistory,
          { id, requestedAt, region, formattedValue },
        ]),
        user.id,
      ]
    );

    return res
      .status(200)
      .json([
        ...filteredCurrentUserHistory,
        { id, requestedAt, region, formattedValue },
      ]);
  } catch (error) {
    return res.status(500).json({
      message: "Could not update user search region history.",
    });
  }
};

module.exports = updateUserSearchRegionHistory;
