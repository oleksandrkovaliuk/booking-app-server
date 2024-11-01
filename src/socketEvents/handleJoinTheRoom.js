const markAsReadByReciever = require("../api/chats/markAsReadByReciever");
const deleteSpecificNotifications = require("../api/user/notifications/deleteSpecificNotification");

const handleJoinTheRoom = (socket, io) => {
  socket.on("requestJoinRoom", async (data) => {
    socket.join(data.chatId);
    console.log(`${socket.id} joined room: ${data.chatId}`);
    await markAsReadByReciever({
      viewer: data.viewer,
      chatId: data.chatId,
    });

    await deleteSpecificNotifications(data.viewer);
    socket.emit(`${data.chatId}JoinedSuccessfully`, {
      chatId: data.chatId,
      message: "You have joined the room",
    });
  });
};

module.exports = handleJoinTheRoom;
