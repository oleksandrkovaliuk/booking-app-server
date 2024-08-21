const db = require("../../../config/database");
const getTypeOfPlaceQuery = "SELECT * FROM type_of_place;";

const getTypeOfPlace = async (req, res) => {
  try {
    await db.query(getTypeOfPlaceQuery, (dbError, dbResponse) => {
      if (dbError) res.status(500).json({ message: "Internal Server Error" });
      return res.status(200).json({ data: dbResponse?.rows });
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = getTypeOfPlace;
