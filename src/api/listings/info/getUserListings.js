const db = require("../../../config/database");

const getUserListings = async (req, res) => {
  const user = req.user;

  try {
    const dbResponse = await db.query(
      "SELECT * FROM listings WHERE host_name = $1 OR host_email = $2",
      [user.user_name, user.email]
    );
    return res.status(200).json(dbResponse?.rows);
  } catch (error) {
    return res.status(500).json({
      message: `Could not get listings. Please try again.`,
    });
  }
};

module.exports = getUserListings;
