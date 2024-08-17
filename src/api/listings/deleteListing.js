const db = require("../../database");
const deleteListingQuery = "DELETE FROM listings WHERE id = $1";

const deleteListing = (req, res) => {
  const { id } = req.body;

  try {
    db.query(deleteListingQuery, [id], async (error, result) => {
      if (error) throw error;
      else {
        const updatedList = await db.query("SELECT * FROM listings");
        return res.status(200).json({
          message: "Listing deleted successfully",
          data: updatedList?.rows,
        });
      }
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error. Please try again" });
  }
};

module.exports = deleteListing;
