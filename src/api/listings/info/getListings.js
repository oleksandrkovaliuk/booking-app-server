const db = require("../../../config/database");

const getListings = async (req, res) => {
  try {
    const dbResponse = await db.query("SELECT * FROM listings");
    return res.status(200).json({ data: dbResponse?.rows });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error. Please try again" });
  }
};

module.exports = getListings;
