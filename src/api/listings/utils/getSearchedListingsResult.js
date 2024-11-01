const GetFilteredListings = require("./getFilteredListing");
const filteringListingBySearch = require("./getListingBySearchOptions");

const getSearchedListingsResult = ({ listings, options, excludeCategory }) => {
  if (!options || !listings?.length) throw new Error("Options are required");
  const parsedParams = JSON.parse(options);

  const search_result = filteringListingBySearch({
    listings: listings,
    search_date: parsedParams.search_date
      ? JSON.parse(parsedParams.search_date)
      : null,
    search_place: parsedParams.search_place
      ? JSON.parse(parsedParams.search_place)
      : null,
    search_includePets: parsedParams.search_includePets
      ? JSON.parse(parsedParams.search_includePets)
      : null,
    search_category_id:
      !excludeCategory && parsedParams.search_category_id
        ? JSON.parse(parsedParams.search_category_id)
        : null,
    search_amountOfGuests: parsedParams.search_amountOfGuests
      ? JSON.parse(parsedParams.search_amountOfGuests)
      : null,
  });

  if (!search_result.length) return [];

  if (
    parsedParams.search_category_id ||
    parsedParams.filter_accesable ||
    parsedParams.filter_price_range ||
    parsedParams.filter_shared_room ||
    parsedParams.filter_type_of_place
  ) {
    const filteredListings = GetFilteredListings({
      search_result: search_result,
      accesable: parsedParams.filter_accesable
        ? JSON.parse(parsedParams.filter_accesable)
        : null,
      price_range: parsedParams.filter_price_range
        ? JSON.parse(parsedParams.filter_price_range)
        : null,
      shared_room: parsedParams.filter_shared_room
        ? JSON.parse(parsedParams.filter_shared_room)
        : null,
      type_of_place: parsedParams.filter_type_of_place
        ? JSON.parse(parsedParams.filter_type_of_place)
        : null,
      category_id:
        !excludeCategory && parsedParams.search_category_id
          ? JSON.parse(parsedParams.search_category_id)
          : null,
    });

    return filteredListings;
  } else {
    return search_result;
  }
};

module.exports = getSearchedListingsResult;
