const db = require("../../../config/database");

const getUserListings = async (req, res) => {
  const { user_name, user_email } = req.params;
  try {
    const dbResponse = await db.query(
      "SELECT * FROM listings WHERE host_name = $1 OR host_email = $2",
      [user_name, user_email]
    );
    return res.status(200).json({ data: dbResponse?.rows });
  } catch (error) {
    return res.status(500).json({
      message: `Could not get listings. Please try again.`,
    });
  }
};

module.exports = getUserListings;
