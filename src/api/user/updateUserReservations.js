const db = require("../../config/database");
const getExistingUserReservationsQuery =
  "SELECT * FROM chats WHERE reciever = $1 AND sender = $2 AND listing_id = $3";

const updateUserReservations = async (req, res) => {
  const {
    host_email,
    listing_id,
    guest_message,
    payment_intent,
    payment_intent_client_secret,
    reservation_dates,
  } = req.body;

  const user = req.user;

  try {
    if (
      !host_email ||
      !user.email ||
      !listing_id ||
      !payment_intent ||
      !payment_intent_client_secret ||
      !reservation_dates
    ) {
      return res.status(400).json({
        message: "Invalid data provided. Please try again",
      });
    }

    const { rows } = await db.query(getExistingUserReservationsQuery, [
      host_email,
      user.email,
      listing_id,
    ]);

    if (!rows[0]) {
      await db.query(
        "INSERT INTO chats (sender , reciever , listing_id , chat_data , payment_intent , payment_intent_client_secret , reservation_dates) VALUES ($1 , $2 , $3 , $4 , $5 , $6 , $7)",
        [
          user.email,
          host_email,
          listing_id,
          JSON.stringify([
            {
              to: host_email,
              from: user.email,
              seenByReceiver: false,
              sent_at: new Date().toISOString(),
              message: `You have a new reservation request from ${
                user.email
              }. ${guest_message ? `Message: ${guest_message}}` : ""}`,
            },
          ]),
          payment_intent,
          payment_intent_client_secret,
          reservation_dates,
        ]
      );

      const { rows: createdChat } = await db.query(
        getExistingUserReservationsQuery,
        [host_email, user.email, listing_id]
      );

      return res.status(200).json({
        message: "Reservation requested successfully",
        chatId: createdChat[0].id,
      });
    } else {
      return res.status(400).json({
        message:
          "Reservation already exists. Please check you inbox or contact us if you have any questions.",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error. Please try again" });
  }
};

module.exports = updateUserReservations;
