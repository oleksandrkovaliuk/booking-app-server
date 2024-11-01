const markAsReadByReciever = require("../api/chats/markAsReadByReciever");

const handleUpdateConversation = (socket, io) => {
  socket.on("requestUpdateConversation", async (data) => {
    if (!data.chatId) return;
    console.log("Current rooms:", socket.rooms);
    console.log("RoomId", data.chatId);
    console.log(data.viewer, "viewer rrr");
    const { success, reciever } = await markAsReadByReciever({
      viewer: data.viewer,
      chatId: data.chatId,
    });

    console.log(reciever);
    if (!success || !reciever) {
      return;
    } else {
      io.to(data.chatId).emit("readyToBeUpdate", {
        reciever,
        chatId: data.chatId,
        message: "A user has entered the conversation",
      });
    }
  });
};

module.exports = handleUpdateConversation;
