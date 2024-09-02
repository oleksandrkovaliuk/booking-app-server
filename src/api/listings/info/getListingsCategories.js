const db = require("../../../config/database");
const { getListingCategoriesQuery } = require("../../../query/querys");

const getListingCategories = async (req, res) => {
  try {
    const dbResponse = await db.query(getListingCategoriesQuery);
    if (!dbResponse?.rows[0])
      return res.status(404).json({ message: "No categories found" });

    return res.status(200).json(dbResponse?.rows);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = getListingCategories;
