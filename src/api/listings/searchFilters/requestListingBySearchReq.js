const db = require("../../../config/database");

const requestListingBySearchReq = async (req, res) => {
  const {
    search_place,
    search_date,
    search_amountOfGuests,
    search_includePets,
    search_category_id,
  } = req.body;

  try {
    const listings = await db.query(
      "SELECT * FROM listings WHERE iscomplete = true"
    );

    if (!listings) throw Error();

    const extractAddressDetails = (listing) => {
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

      return { region, country };
    };

    const isDateDisabled = (disabled_dates) =>
      disabled_dates.some(
        (date) =>
          search_date.start.day === date.day &&
          search_date.start.month === date.month &&
          search_date.start.year === date.year
      );

    const matchesSearchFilters = (listing) => {
      const { region, country } = extractAddressDetails(listing);

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

      if (search_date && isDateDisabled(listing.disabled_dates)) {
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

    const filteredListing = listings.rows.filter((listing) =>
      matchesSearchFilters(listing)
    );

    if (!filteredListing.length)
      return res.status(404).json({ message: "No listings found" });

    return res.status(200).json(filteredListing);
  } catch (error) {
    return res.status(500).json({
      message:
        "Something went wrong with getting listing by request. Please try again",
    });
  }
};

module.exports = requestListingBySearchReq;
