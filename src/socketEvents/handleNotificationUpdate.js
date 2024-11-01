const handleNotificationUpdate = (socket, io) => {
  socket.on("notificationUpdate", (data) => {
    if (!data.viewer) return;
    socket.broadcast.emit(`${data.viewer} notificationUpdate`);
  });
};

module.exports = handleNotificationUpdate;
