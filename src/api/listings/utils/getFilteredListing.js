const GetFilteredListings = ({
  search_result,
  accesable,
  price_range,
  shared_room,
  category_id,
  type_of_place,
}) => {
  return search_result.filter((listing) => {
    const matchedPriceRange = price_range
      ? Number(listing.price) >= Number(price_range[0]) &&
        Number(listing.price) <= Number(price_range[1])
      : true;

    const matchedTypeOfPlace =
      !shared_room && type_of_place
        ? type_of_place === listing.type.id
        : shared_room
        ? listing.type.type_name === "A shared room"
        : true;

    const matchedAccesableOption =
      accesable !== null && accesable ? listing.accesable === accesable : true;

    const matchedByCategoryId = category_id
      ? listing.category.id === category_id
      : true;

    return (
      matchedPriceRange &&
      matchedTypeOfPlace &&
      matchedAccesableOption &&
      matchedByCategoryId
    );
  });
};

module.exports = GetFilteredListings;
