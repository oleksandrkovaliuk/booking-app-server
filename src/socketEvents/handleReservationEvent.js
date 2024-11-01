const insertSpecificNotification = require("../api/user/notifications/insertSpecificNotification");

const handleReservationEvent = (socket, io) => {
  socket.on("reservationRequest", async (data) => {
    await insertSpecificNotification({
      type: data.type,
      message: data.message,
      user_email: data.user_email,
      listing_id: data.listing_id,
      redirect_href: data.redirect_href,
    });
    socket.broadcast.emit(`${data.user_email} notificationUpdate`);
  });
};

module.exports = handleReservationEvent;
