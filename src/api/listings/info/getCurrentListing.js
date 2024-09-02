const db = require("../../../config/database");

const getCurrentListing = async (req, res) => {
  const { id } = req.params;

  try {
    const dbResponse = await db.query(
      "SELECT * FROM listings WHERE id = $1  ",
      [id]
    );

    return res.status(200).json(dbResponse?.rows[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Could not get listing. Please try again" });
  }
};

module.exports = getCurrentListing;
