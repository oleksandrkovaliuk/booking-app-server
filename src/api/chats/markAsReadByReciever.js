const db = require("../../config/database");

const markAsReadByReciever = async ({ viewer, chatId }) => {
  try {
    if (!viewer || !chatId) {
      return {
        success: false,
        message: "Invalid data provided. Please try again",
      };
    }

    const { rows } = await db.query("SELECT * FROM chats WHERE id = $1", [
      chatId,
    ]);
    if (!rows[0]) {
      return {
        success: false,
        message: "Chat not found. Please try again",
      };
    }

    const chatData = rows[0].chat_data || [];

    const updatedChatData = chatData.map((message) => {
      if (message.to === viewer) {
        return { ...message, seenByReceiver: true };
      }
      return { ...message };
    });

    await db.query("UPDATE chats SET chat_data = $1  WHERE id = $2", [
      JSON.stringify(updatedChatData),
      chatId,
    ]);

    return {
      success: true,
      reciever: rows[0].reciever,
      message: "Successfully marked as read",
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal Server Error. Please try again later.",
    };
  }
};

module.exports = markAsReadByReciever;
