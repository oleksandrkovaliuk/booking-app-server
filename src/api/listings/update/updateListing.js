const db = require("../../../config/database");

const updateListing = async (req, res) => {
  const { column, data, id } = req.body;
  const convertedData = column === "images" ? JSON.stringify(data) : data;

  const columnIsBoolean = typeof data !== "boolean" && !data;

  if (!column || !id || columnIsBoolean)
    return res.status(400).json({ message: "Bad Request. Please try again" });

  try {
    await db.query(`UPDATE listings SET ${column} = $1 WHERE id = $2`, [
      column === "price" ? parseInt(data.replace(/,/g, ""), 10) : convertedData,
      id,
    ]);
    return res.status(200).json({ message: "Listing updated successfully" });
  } catch (error) {
    return res.status(500).json({
      message:
        "Something went wrong with updating your listing. Please try again",
    });
  }
};

module.exports = updateListing;
