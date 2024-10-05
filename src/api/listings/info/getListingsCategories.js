const db = require("../../../config/database");
const getSearchedListingsResult = require("../utils/getSearchedListingsResult");

const { getListingCategoriesQuery } = require("../../../query/querys");

const getListingCategories = async (req, res) => {
  const params = req.query;
  try {
    const { rows: categories } = await db.query(getListingCategoriesQuery);

    const { rows: listings } = await db.query(
      "SELECT * FROM listings WHERE iscomplete = true"
    );

    if (!categories?.length || !listings?.length)
      return res.status(404).json({ message: "No categories found" });

    if (params.options) {
      const searchedListingResult = getSearchedListingsResult({
        listings: listings,
        options: params.options,
        excludeCategory: true,
      });

      const filteredCategories = searchedListingResult?.length
        ? categories.filter((category) =>
            searchedListingResult.some(
              (listing) => listing.category.id === category.id
            )
          )
        : categories.filter((category) =>
            listings.some((listing) => listing.category.id === category.id)
          );

      if (!filteredCategories?.length) throw new Error();

      return res.status(200).json(filteredCategories);
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = getListingCategories;
