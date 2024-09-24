const matchesSearchFilters = (
  listing,
  search_place,
  search_date,
  search_includePets,
  search_category_id,
  search_amountOfGuests
) => {
  const addressComponents = listing.address.detailedAddressComponent;
  const listingAddressDetails = addressComponents.filter((item) =>
    ["administrative_area_level_1", "country"].includes(item.types[0])
  );

  const region = listingAddressDetails.find((item) =>
    item.types.includes("administrative_area_level_1")
  );
  const country = listingAddressDetails.find((item) =>
    item.types.includes("country")
  );

  const matchAddresCondition = search_category_id
    ? (search_place?.city || search_place?.country) &&
      (!region?.long_name.startsWith(search_place.city) ||
        !country?.long_name.startsWith(search_place.country))
    : search_place?.city &&
      search_place?.country &&
      (!region?.long_name.startsWith(search_place.city) ||
        !country?.long_name.startsWith(search_place.country));

  if (matchAddresCondition) {
    return false;
  }

  if (
    search_date &&
    listing.disabled_dates.some((disabledDate) => {
      const disabled = new Date(
        disabledDate.year,
        disabledDate.month - 1,
        disabledDate.day
      );
      const start = new Date(
        search_date.start.year,
        search_date.start.month - 1,
        search_date.start.day
      );
      const end = new Date(
        search_date.end.year,
        search_date.end.month - 1,
        search_date.end.day
      );

      return disabled >= start && disabled <= end;
    })
  ) {
    return false;
  }

  if (search_amountOfGuests && listing.guests < search_amountOfGuests) {
    return false;
  }

  if (search_includePets && listing.pets_allowed !== search_includePets) {
    return false;
  }

  if (search_category_id && listing.category.id !== search_category_id) {
    return false;
  }

  return true;
};

const GetListingBySearchOptions = ({
  listings,
  search_place,
  search_date,
  search_includePets,
  search_category_id,
  search_amountOfGuests,
}) => {
  const filteredListing = listings.filter((listing) =>
    matchesSearchFilters(
      listing,
      search_place,
      search_date,
      search_includePets,
      search_category_id,
      search_amountOfGuests
    )
  );

  return filteredListing;
};

module.exports = GetListingBySearchOptions;
