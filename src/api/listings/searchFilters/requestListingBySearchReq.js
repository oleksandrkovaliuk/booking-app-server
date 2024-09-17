const db = require("../../../config/database");
const GetFilteredListings = require("../utils/getFilteredListing");
const GetListingBySearchOptions = require("../utils/getListingBySearchOptions");

const requestListingBySearchReq = async (req, res) => {
  const {
    search_place,
    search_date,
    search_includePets,
    search_category_id,
    search_amountOfGuests,

    accesable,
    price_range,
    shared_room,
    category_id,
    type_of_place,
    returnFiltered,
  } = req.body;

  try {
    const listings = await db.query(
      "SELECT * FROM listings WHERE iscomplete = true"
    );

    if (!listings) throw Error();

    const search_result = GetListingBySearchOptions({
      listings: listings.rows,
      search_date: search_date,
      search_place: search_place,
      search_includePets: search_includePets,
      search_category_id: search_category_id,
      search_amountOfGuests: search_amountOfGuests,
    });

    if (!search_result.length)
      return res.status(404).json({ message: "No listings found" });

    if (returnFiltered) {
      const filteredListings = GetFilteredListings({
        search_result: search_result,
        accesable: accesable,
        price_range: price_range,
        shared_room: shared_room,
        category_id: category_id,
        type_of_place: type_of_place,
      });

      return res.status(200).json(filteredListings);
    } else {
      return res.status(200).json(search_result);
    }
  } catch (error) {
    console.log(error, "error");
    return res.status(500).json({
      message:
        "Something went wrong with getting listing by request. Please try again",
    });
  }
};

module.exports = requestListingBySearchReq;
