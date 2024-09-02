const db = require("../../../config/database");
const getTypeOfPlaceQuery = "SELECT * FROM type_of_place;";

const getTypeOfPlace = async (_, res) => {
  try {
    const { rows } = await db.query(getTypeOfPlaceQuery);
    if (!rows[0])
      return res.status(404).json({ message: "No types of place found" });
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = getTypeOfPlace;
