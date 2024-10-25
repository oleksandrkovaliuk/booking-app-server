const db = require("../../../config/database");

const deleteSpecificNotifications = async (user_email, type) => {
  try {
    await db.query(
      `DELETE FROM users_notifications WHERE user_email = $1 ${
        type && `AND type = $2`
      }`,
      type ? [user_email, type] : [user_email]
    );
  } catch (error) {
    return "Something went wrong. Please try again";
  }
};

module.exports = deleteSpecificNotifications;
