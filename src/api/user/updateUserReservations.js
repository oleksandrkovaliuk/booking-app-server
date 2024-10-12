const db = require("../../config/database");
const getExistingUserReservationsQuery =
  "SELECT * FROM users_reservations WHERE host_email = $1";

const updateUserReservationQuery =
  "UPDATE users_reservations SET reservation_requests = $2 WHERE host_email = $1";

const updateUserReservations = async (req, res) => {
  const {
    guest_email,
    host_email,
    listing_id,
    guest_message,
    payment_intent,
    payment_intent_client_secret,
  } = req.body;
  try {
    if (
      !host_email ||
      !guest_email ||
      !listing_id ||
      !payment_intent ||
      !payment_intent_client_secret
    ) {
      return res.status(400).json({
        message: "Invalid data provided. Please try again",
      });
    }

    const { rows } = await db.query(getExistingUserReservationsQuery, [
      host_email,
    ]);

    if (!rows[0]) {
      await db.query("INSERT INTO users_reservations VALUES ($1, $2)", [
        host_email,
        JSON.stringify([
          {
            listing_id,
            guest_email,
            guest_message,
            payment_intent,
            payment_intent_client_secret,
          },
        ]),
      ]);

      return res.status(200).json({
        message: "Reservation requested successfully",
      });
    } else {
      const existingUserReservations = rows[0].reservation_requests.filter(
        (reservation) => {
          return (
            reservation.listing_id === listing_id &&
            guest_email === reservation.guest_email
          );
        }
      );

      if (existingUserReservations.length > 0) {
        return res.status(400).json({
          message:
            "Reservation already exists. Please check you inbox or contact us if you have any questions.",
        });
      }

      await db.query(updateUserReservationQuery, [
        host_email,
        JSON.stringify([
          ...rows[0].reservation_requests,
          {
            listing_id,
            guest_email,
            guest_message,
            payment_intent,
            payment_intent_client_secret,
          },
        ]),
      ]);

      return res.status(200).json({
        message: "Reservation requested successfully",
      });
    }
  } catch (error) {
    console.log(error, "error");
    return res
      .status(500)
      .json({ message: "Internal Server Error. Please try again" });
  }
};

module.exports = updateUserReservations;
