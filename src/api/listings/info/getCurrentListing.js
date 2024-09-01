const db = require("../../../config/database");

const getCurrentListing = async (req, res) => {
  const { id, user_name } = req.params;

  try {
    const dbResponse = await db.query(
      "SELECT * FROM listings WHERE id = $1 AND host_name = $2 ",
      [id, user_name]
    );

    return res.status(200).json({ data: dbResponse?.rows });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Could not get listing. Please try again" });
  }
};

module.exports = getCurrentListing;
