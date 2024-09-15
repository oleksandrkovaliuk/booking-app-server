const db = require("../../../config/database");

const getAvailableCategories = async (req, res) => {
  const { listings } = req.body;

  try {
    if (!listings.length)
      return res.status(404).json({ message: "Incorrect data provided" });

    const categories = await db.query("SELECT * FROM listings_categories ");

    const availableCategories = categories.rows.filter((category) =>
      listings.some((listing) => listing.category.id === category.id)
    );

    return res.status(200).json(availableCategories);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = getAvailableCategories;
