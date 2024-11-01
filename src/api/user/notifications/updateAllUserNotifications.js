const db = require("../../../config/database");

const updateAllUserNotifications = async (req, res) => {
  const user = req.user;
  try {
    await db.query(
      "UPDATE users_notifications SET seen = true WHERE user_email = $1",
      [user.email]
    );

    return res.status(200).json({
      message: "Notifications updated successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error. Please try again" });
  }
};

module.exports = updateAllUserNotifications;
