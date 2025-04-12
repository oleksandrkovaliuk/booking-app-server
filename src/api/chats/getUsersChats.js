const db = require("../../config/database");

const getUsersChats = async (req, res) => {
  const user = req.user;

  try {
    if (!user.email) {
      return res.status(404).json({ message: "User not found" });
    }
    const { rows: chats } = await db.query(
      "SELECT * FROM chats WHERE sender = $1 OR reciever = $1",
      [user.email]
    );

    const userEmails = [
      ...new Set(chats.map((chat) => [chat.sender, chat.reciever]).flat()),
    ];

    const { rows: users } = await db.query(
      "SELECT email, user_name, img_url FROM users WHERE email = ANY($1)",
      [userEmails]
    );

    const { rows: listings } = await db.query("SELECT * FROM listings");

    const listingsMap = listings.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {});

    const userMap = users.reduce((acc, curr) => {
      acc[curr.email] = curr;
      return acc;
    }, {});

    const formattedChats = chats.map((chat) => {
      const sender = userMap[chat.sender];
      const reciever = userMap[chat.reciever];
      const listing = listingsMap[chat.listing_id];

      console.log(listing);
      const isReciever = chat.reciever === user.email;
      const chatPartner = isReciever
        ? {
            user_name: sender.user_name,
            img_url: sender.img_url,
            email: sender.email,
          }
        : {
            user_name: reciever.user_name,
            img_url: reciever.img_url,
            email: reciever.email,
          };

      return {
        id: chat.id,

        listing_info: {
          id: listing.id,
          address: listing.address.detailedAddressComponent,
          preview: listing.images[0].url,
        },

        chatPartner: chatPartner,
        reservation_dates: chat.reservation_dates,
      };
    });

    return res.status(200).json(formattedChats);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error. Please try again" });
  }
};

module.exports = getUsersChats;
