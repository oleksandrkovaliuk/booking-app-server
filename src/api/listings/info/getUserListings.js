const jwt = require("jsonwebtoken");
const db = require("../../../config/database");

const getUserListings = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JSON_SECRET);
  try {
    const dbResponse = await db.query(
      "SELECT * FROM listings WHERE host_name = $1 OR host_email = $2",
      [decoded.user_name, decoded.email]
    );
    return res.status(200).json(dbResponse?.rows);
  } catch (error) {
    return res.status(500).json({
      message: `Could not get listings. Please try again.`,
    });
  }
};

module.exports = getUserListings;
