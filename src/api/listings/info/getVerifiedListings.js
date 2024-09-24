const db = require("../../../config/database");
const GetFilteredListings = require("../utils/getFilteredListing");
const filteringListingBySearch = require("../utils/getListingBySearchOptions");

const getVerifiedListings = async (req, res) => {
  const params = req.query;

  try {
    const { rows } = await db.query(
      "SELECT * FROM listings WHERE iscomplete = true"
    );
    if (!rows[0]) return res.status(404).json({ message: "No listings found" });

    if (params.options) {
      const parsedParams = JSON.parse(params.options);

      const search_result = filteringListingBySearch({
        listings: rows,
        search_date: parsedParams.search_date
          ? JSON.parse(parsedParams.search_date)
          : null,
        search_place: parsedParams.search_place
          ? JSON.parse(parsedParams.search_place)
          : null,
        search_includePets: parsedParams.search_includePets
          ? JSON.parse(parsedParams.search_includePets)
          : null,
        search_category_id: parsedParams.search_category_id
          ? JSON.parse(parsedParams.search_category_id)
          : null,
        search_amountOfGuests: parsedParams.search_amountOfGuests
          ? JSON.parse(parsedParams.search_amountOfGuests)
          : null,
      });

      if (!search_result.length) return res.status(200).json(rows);

      if (
        parsedParams.search_category_id ||
        parsedParams.filter_accesable ||
        parsedParams.filter_price_range ||
        parsedParams.filter_shared_room ||
        parsedParams.filter_type_of_place
      ) {
        const filteredListings = GetFilteredListings({
          search_result: search_result,
          accesable: parsedParams.search_accesable
            ? JSON.parse(parsedParams.search_accesable)
            : null,
          price_range: parsedParams.filter_price_range
            ? JSON.parse(parsedParams.filter_price_range)
            : null,
          shared_room: parsedParams.filter_shared_room
            ? JSON.parse(parsedParams.filter_shared_room)
            : null,
          category_id: parsedParams.search_category_id
            ? JSON.parse(parsedParams.search_category_id)
            : null,
          type_of_place: parsedParams.filter_type_of_place
            ? JSON.parse(parsedParams.filter_type_of_place)
            : null,
        });

        return res.status(200).json(filteredListings);
      } else {
        return res.status(200).json(search_result);
      }
    } else {
      return res.status(200).json(rows);
    }
  } catch (error) {
    console.log(error, "error");
    return res
      .status(500)
      .json({ message: "Internal Server Error. Please try again" });
  }
};

module.exports = getVerifiedListings;
