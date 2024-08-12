const db = require("../../database");
const createListingQuery =
  "INSERT INTO listings ( hostname, hostemail , category, type, cordinates, address, guests, pets_allowed , accesable, images, title, aboutplace, placeis, notes, price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12 , $13 , $14, $15) RETURNING *";

const createListing = async (req, res) => {
  const {
    hostname,
    hostemail,
    category,
    typeOfPlace,
    cordinates,
    address,
    guests,
    additionalDetails,
    images,
    title,
    aboutPlace,
    placeIs,
    notes,
    price,
  } = req.body;

  const isNotDataValid =
    !hostname ||
    !hostemail ||
    !category ||
    !typeOfPlace ||
    !cordinates ||
    !address ||
    !guests ||
    !additionalDetails ||
    !images ||
    !title ||
    !aboutPlace ||
    !placeIs ||
    !notes ||
    !price;

  if (isNotDataValid)
    res.status(400).json({
      message:
        "Invalid data provided. Please make sure all fields are filled correctly",
    });

  try {
    await db.query(createListingQuery, [
      hostname,
      hostemail,
      category,
      typeOfPlace,
      cordinates,
      address,
      guests,
      additionalDetails.pets,
      additionalDetails.accesable,
      images,
      title,
      aboutPlace,
      placeIs,
      notes,
      parseInt(price.replace(/,/g, ""), 10),
    ]);
    return res.status(200).json({ message: "Listing created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error. Please try again" });
  }
};

module.exports = createListing;
