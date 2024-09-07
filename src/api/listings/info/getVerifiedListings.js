const db = require("../../../config/database");

const getVerifiedListings = async (_, res) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM listings WHERE iscomplete = true"
    );
    if (!rows[0]) return res.status(404).json({ message: "No listings found" });
    return res.status(200).json(rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error. Please try again" });
  }
};

module.exports = getVerifiedListings;
