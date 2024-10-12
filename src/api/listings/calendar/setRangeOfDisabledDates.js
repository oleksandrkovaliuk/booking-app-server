const db = require("../../../config/database");
const updatedDisabledDatesQuery =
  "UPDATE listings SET disabled_dates = $1 WHERE id = $2";

const setRangeOfDisabledDates = async (req, res) => {
  const { disabledDates, id } = req.body;

  try {
    const { rows } = await db.query("SELECT * from listings WHERE id = $1", [
      id,
    ]);

    if (!rows[0] || !disabledDates) {
      return res
        .status(404)
        .json({ message: "We could proccess your request. Please try again" });
    }

    const existingDisabledDates = rows[0].disabled_dates || [];

    const updatedSet = new Set([
      ...disabledDates.map((date) => JSON.stringify(date)),
      ...existingDisabledDates.map((date) => JSON.stringify(date)),
    ]);

    const resultArray = Array.from(updatedSet).map((date) => JSON.parse(date));

    if (!resultArray.length) {
      return res
        .status(404)
        .json({ message: "We could proccess your request. Please try again" });
    }

    await db.query(updatedDisabledDatesQuery, [
      JSON.stringify(resultArray),
      id,
    ]);

    return res
      .status(200)
      .json({ message: "Disabled successfully dates updated" });
  } catch (error) {
    console.log(error, "error");
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again" });
  }
};

module.exports = setRangeOfDisabledDates;
