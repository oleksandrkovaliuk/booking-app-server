const db = require("../../../config/database");

const insertSpecificNotification = async ({
  type,
  message,
  user_email,
  listing_id,
  redirect_href,
}) => {
  try {
    if (!message || !user_email || !type) {
      return "Invalid data provided. Please try again";
    }

    await db.query(
      "INSERT INTO users_notifications (user_email , message,  listing_id, redirect_href , type) VALUES ($1, $2, $3, $4 , $5)",
      [user_email, message, listing_id, redirect_href, type]
    );

    return "Notification sent successfully";
  } catch (error) {
    return "Something went wrong. Please try again";
  }
};

module.exports = insertSpecificNotification;
