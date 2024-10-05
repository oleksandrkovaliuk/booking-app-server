const db = require("../../../config/database");
const getSearchedListingsResult = require("../utils/getSearchedListingsResult");

const getSearchedListings = async (req, res) => {
  const params = req.query;

  try {
    const { rows } = await db.query(
      "SELECT * FROM listings WHERE iscomplete = true"
    );
    if (!rows[0]) return res.status(404).json({ message: "No listings found" });

    if (params.options) {
      const searchedListingResult = getSearchedListingsResult({
        listings: rows,
        options: params.options,
        excludeCategory: false,
      });

      return res.status(200).json(searchedListingResult);
    } else {
      return res.status(200).json(rows);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error. Please try again" });
  }
};

module.exports = getSearchedListings;
