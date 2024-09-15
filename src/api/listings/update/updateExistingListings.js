const updateExitistingListings = async (req, res) => {
  const { listings, type_of_place, price_range, accesable, shared_room } =
    req.body;

  try {
    if (!listings) {
      return res.status(404).json({ error: "Couldnt find provided listings." });
    }
    const filteredListings = listings.filter((listing) => {
      const matchedPriceRange = price_range
        ? Number(listing.price) >= Number(price_range[0]) &&
          Number(listing.price) <= Number(price_range[1])
        : true;

      const matchedTypeOfPlace =
        !shared_room && type_of_place
          ? type_of_place.id === listing.type.id
          : shared_room
          ? listing.type.type_name === "A shared room"
          : true;

      const matchedAccesableOption =
        accesable !== null ? listing.accesable === accesable : true;

      return matchedPriceRange && matchedTypeOfPlace && matchedAccesableOption;
    });

    return res.status(200).json(filteredListings);
  } catch (error) {
    console.log(error, "error");
    return res
      .status(500)
      .json({ error: "Something went wrong while updating." });
  }
};

module.exports = updateExitistingListings;
