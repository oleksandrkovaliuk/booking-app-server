const deleteSpecificNotifications = require("../api/user/notifications/deleteSpecificNotification");

const handleNotificationReaded = (socket, io) => {
  socket.on("notificationReaded", async (data) => {
    if (!data.viewer || !data.type) return;
    await deleteSpecificNotifications(data.viewer, data.type);
  });
};

module.exports = handleNotificationReaded;
