const db = require("../../config/database");

const markAsReadByReciever = async ({ reciever, chatId }) => {
  try {
    if (!reciever || !chatId) {
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
      if (message.to === reciever) {
        return { ...message, seen: true };
      }
      return message;
    });

    await db.query("UPDATE chats SET chat_data = $1 , seen = true WHERE id = $2", [
      JSON.stringify(updatedChatData),
      chatId,
    ]);

    return {
      success: true,
      message: "Internal Server Error. Please try again later.",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Internal Server Error. Please try again later.",
    };
  }
};

module.exports = markAsReadByReciever;
