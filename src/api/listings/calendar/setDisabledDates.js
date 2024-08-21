const db = require("../../../config/database");
const updatedDisabledDatesQuery =
  "UPDATE listings SET disabled_dates = $1 , iscomplete = $2 WHERE id = $3";
const setDisabledDates = async (req, res) => {
  const { disabledDates, id } = req.body;
  const isValidData = !disabledDates || !id;
  if (isValidData) {
    return res
      .status(400)
      .json({ message: "Invalid data provided. Please try again" });
  }
  try {
    await db.query(updatedDisabledDatesQuery, [
      JSON.stringify(disabledDates),
      true,
      id,
    ]);
    return res.status(200).json({ message: "Disabled dates updated" });
  } catch (error) {
    return res.status(500).json({
      message:
        "Something went wrong with updatin your avalibilities. Please try again",
    });
  }
};

module.exports = setDisabledDates;
