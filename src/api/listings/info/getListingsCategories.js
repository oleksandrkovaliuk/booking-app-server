const db = require("../../../config/database");
const { getListingCategoriesQuery } = require("../../../query/querys");

const getListingCategories = async (req, res) => {
  try {
    const dbResponse = await db.query(getListingCategoriesQuery);
    return res.status(200).json({ data: dbResponse?.rows });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = getListingCategories;
