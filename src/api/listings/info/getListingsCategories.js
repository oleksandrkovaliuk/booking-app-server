const db = require("../../../config/database");
const { getListingCategoriesQuery } = require("../../../query/querys");

const getListingCategories = async (req, res) => {
  try {
    const { rows: categories } = await db.query(getListingCategoriesQuery);
    const { rows: listings } = await db.query(
      "SELECT * FROM listings WHERE iscomplete = true"
    );

    if (!categories?.length || !listings?.length)
      return res.status(404).json({ message: "No categories found" });

    const availableCategories = categories.filter((category) =>
      listings.some((listing) => listing.category.id === category.id)
    );

    return res.status(200).json(availableCategories);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = getListingCategories;
