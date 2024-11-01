const db = require("../../config/database");

const newChatMessage = async (req, res) => {
  const { chatId, message, from, to } = req.body;
  try {
    if (!chatId || !message || !from || !to) {
      return res
        .status(400)
        .json({ message: "Invalid data provided. Please try again" });
    }

    const { rows } = await db.query("SELECT * FROM chats WHERE id = $1 ", [
      JSON.parse(chatId),
    ]);

    const chat = rows[0];
    const updatedChatData = chat.chat_data;

    updatedChatData.push({
      to,
      from,
      seenByReceiver: false,
      sent_at: new Date().toISOString(),
      message,
    });

    await db.query("UPDATE chats SET chat_data = $1 WHERE id = $2", [
      JSON.stringify(updatedChatData),
      JSON.parse(chatId),
    ]);

    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again" });
  }
};

module.exports = newChatMessage;
