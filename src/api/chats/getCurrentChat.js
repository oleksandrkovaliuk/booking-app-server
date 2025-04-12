const db = require("../../config/database");

const getCurrentChat = async (req, res) => {
  const user = req.user;
  const { chatId, amouthOfMessages } = req.query;
  try {
    if (!chatId) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const { rows } = await db.query(
      `SELECT chats.*, users.email, users.img_url, users.user_name
       FROM chats
       JOIN users ON users.email = CASE
           WHEN chats.reciever = $2 THEN chats.sender
           ELSE chats.reciever
       END
       WHERE chats.id = $1 AND (chats.sender = $2 OR chats.reciever = $2)`,
      [JSON.parse(chatId), user.email]
    );

    if (!rows[0]) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const amouthOfMessagesToGet =
      amouthOfMessages >= rows[0].chat_data.length
        ? rows[0].chat_data.length
        : amouthOfMessages;
    const sortedChatData = rows[0].chat_data.slice(
      -amouthOfMessagesToGet || -20
    );

    return res.status(200).json({
      chat_data: sortedChatData,
      reciever: {
        user_email: rows[0].email,
        img_url: rows[0].img_url,
        user_name: rows[0].user_name,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = getCurrentChat;
