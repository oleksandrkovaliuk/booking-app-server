const db = require("../../config/database");

const getCurrentChat = async (req, res) => {
  const user = req.user;
  const { chatId } = req.query;
  try {
    if (!chatId) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const { rows } = await db.query(
      "SELECT * FROM chats WHERE id = $1 AND sender = $2 OR reciever = $2",
      [JSON.parse(chatId), user.email]
    );

    const isReciever = rows[0].reciever === user.email;

    const { rows: chatUser } = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [isReciever ? rows[0].sender : rows[0].reciever]
    );

    if (!rows[0]) {
      return res.status(404).json({ message: "Chat not found" });
    } else {
      const sortedChatData = rows[0].chat_data.splice(
        rows[0].chat_data.length - 20,
        rows[0].chat_data.length
      );
      return res.status(200).json({
        chat_data: sortedChatData,
        reciever: {
          email: chatUser[0].email,
          img_url: chatUser[0].img_url,
          user_name: chatUser[0].user_name,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = getCurrentChat;
