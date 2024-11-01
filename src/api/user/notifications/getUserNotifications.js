const db = require("../../../config/database");

const getUserNotifications = async (req, res) => {
  const user = req.user;
  try {
    const { rows: userChats } = await db.query(
      "SELECT * FROM users_notifications WHERE user_email = $1",
      [user.email]
    );

    return res.status(200).json(userChats);
  } catch (error) {
    console.log(error, "error");
    return res
      .status(500)
      .json({ message: "Internal Server Error. Please try again" });
  }
};

module.exports = getUserNotifications;
