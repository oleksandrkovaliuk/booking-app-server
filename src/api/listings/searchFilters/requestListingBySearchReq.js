const db = require("../../../config/database");
const {
  parseDate,
  isEqualDay,
  isEqualMonth,
  isEqualYear,
} = require("@internationalized/date");

const requestListingBySearchReq = async (req, res) => {
  const {
    search_place,
    search_date,
    search_amountOfGuests,
    search_includePets,
    search_category,
  } = req.body;

  try {
    const listings = await db.query(
      "SELECT * FROM listings WHERE iscomplete = true"
    );

    if (!listings) throw Error();

    const filteredListing = listings.rows.filter((listing) => {
      const listingAddressDetails =
        listing.address.detailedAddressComponent.filter((item) =>
          ["administrative_area_level_1", "country"].includes(item.types[0])
        );
      const region = listingAddressDetails.find((item) =>
        item.types.includes("administrative_area_level_1")
      );
      const country = listingAddressDetails.find((item) =>
        item.types.includes("country")
      );

      console.log(
        "region",
        region?.long_name,
        search_place?.city,
        region?.long_name.startsWith(search_place?.city)
      );
      console.log(
        "country",
        country?.long_name,
        search_place?.country,
        country?.long_name.startsWith(search_place?.country)
      );

      if (
        search_place?.city &&
        region?.long_name &&
        search_place?.country &&
        country?.long_name
      ) {
        if (
          !region?.long_name.startsWith(search_place?.city) ||
          !country?.long_name.startsWith(search_place?.country)
        ) {
          console.log("arent same place");
          return false;
        }
      }

      if (
        search_date &&
        isEqualDay(parseDate(search_date), parseDate(listing.region)) &&
        isEqualMonth(parseDate(search_date), parseDate(listing.category)) &&
        isEqualYear(parseDate(search_date), parseDate(listing.category))
      ) {
        console.log("not include date");
        return false;
      }

      if (search_amountOfGuests && listing.guests < search_amountOfGuests) {
        console.log("not include guests");
        return false;
      }

      if (search_includePets && listing.pets_allowed === false) {
        console.log("not include pets");
        return false;
      }

      if (search_category && listing.category.name !== search_category.name) {
        console.log("not include category");
        return false;
      }
      return true;
    });

    if (!filteredListing.length) throw Error();
    console.log(filteredListing, "filteredListing");
    return res.status(200).json(filteredListing);
  } catch (error) {
    console.log(error, "error");
    return res.status(500).json({
      message:
        "Something went wrong with getting listing by request. Please try again",
    });
  }
};

module.exports = requestListingBySearchReq;
