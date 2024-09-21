const db = require("../../../config/database");

const getFullCategoriesList = async (req, res) => {
  try {
    const { rows: categories } = await db.query(
      "SELECT * FROM listings_categories"
    );

    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = getFullCategoriesList;
