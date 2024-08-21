const db = require("../../../config/database");
const createListingQuery =
  "INSERT INTO listings ( hostname, hostemail , category, type, cordinates, address, guests, pets_allowed , accesable, images, title, aboutplace, placeis, notes, price ,iscomplete ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12 , $13 , $14, $15 , $16) RETURNING *";

const createListing = async (req, res) => {
  const {
    hostname,
    hostemail,
    category,
    type,
    cordinates,
    address,
    guests,
    pets_allowed,
    accesable,
    images,
    title,
    aboutplace,
    placeis,
    notes,
    price,
  } = req.body;

  console.log(
    hostname,
    hostemail,
    category,
    type,
    cordinates,
    address,
    guests,
    pets_allowed,
    accesable,
    images,
    title,
    aboutplace,
    placeis,
    notes,
    price
  );
  const isValidData =
    !hostname ||
    !hostemail ||
    !category ||
    !type ||
    !cordinates ||
    !address ||
    !guests ||
    !images ||
    !title ||
    !aboutplace ||
    !placeis ||
    !notes ||
    !price;

  if (isValidData)
    res.status(400).json({
      message:
        "Invalid data provided. Please make sure all fields are filled correctly",
    });

  try {
    await db.query(createListingQuery, [
      hostname,
      hostemail,
      category,
      type,
      cordinates,
      address,
      guests,
      pets_allowed,
      accesable,
      JSON.stringify(images),
      title,
      aboutplace,
      placeis,
      notes,
      parseInt(price.replace(/,/g, ""), 10),
      false,
    ]);
    return res.status(200).json({ message: "Listing created successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error. Please try again" });
  }
};

module.exports = createListing;
