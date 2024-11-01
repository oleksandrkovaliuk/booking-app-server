const db = require("../../config/database");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const proccesPayment = async (req, res) => {
  const { chatId } = req.body;

  try {
    if (!chatId) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    const { rows } = await db.query("SELECT * FROM chats WHERE id = $1 ", [
      JSON.parse(chatId),
    ]);

    const chat = rows[0];
    if (!chat) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    const paymentIntent = chat.payment_intent;

    if (!paymentIntent) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const capturedPayment = await stripe.paymentIntents.capture(paymentIntent);

    if (!capturedPayment) {
      return res.status(500).json({ message: "Failed to procces payment." });
    }

    const updatedChatData = chat.chat_data.map((message) => {
      if (message.required_reservation) {
        const { required_reservation, ...rest } = message;
        return {
          ...rest,
        };
      }

      return message;
    });

    updatedChatData.push({
      to: chat.sender,
      from: chat.reciever,
      seenByReceiver: false,
      sent_at: new Date().toISOString(),
      message: `${chat.reciever} has approved your recervation. Thank you for booking with us.`,
    });

    const messageToGuest =
      "Payment processed successfully. Thank you for booking with us.";

    const redirectHref = `/manage/inbox?chatId=${chatId}`;

    await Promise.all([
      await db.query("UPDATE chats SET chat_data = $1 WHERE id = $2", [
        JSON.stringify(updatedChatData),
        JSON.parse(chatId),
      ]),
      await db.query(
        "INSERT INTO users_notifications (user_email , message,  listing_id, redirect_href , type) VALUES ($1, $2, $3, $4 , $5)",
        [
          chat.sender,
          messageToGuest,
          chat.listing_id,
          redirectHref,
          "INBOX_MESSAGE",
        ]
      ),
    ]);

    return res
      .status(200)
      .json({ message: "Payment processed successfully", sender: chat.sender });
  } catch (error) {
    console.log(error, "error");
    return res
      .status(500)
      .json({ message: "Internal Server Error. Please try again" });
  }
};

module.exports = proccesPayment;
