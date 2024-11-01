const db = require("../../config/database");

const getUser = async (req, res) => {
  const { user_email, user_name } = req.params;

  try {
    if (!user_email)
      return res.status(400).json({
        message: "Couldnt determine user name and email",
      });

    const { rows } = await db.query(
      "SELECT * FROM users WHERE email = $1 OR user_name = $2",
      [user_email, user_name]
    );

    if (!rows[0])
      return res.status(404).json({
        message: "User not found",
      });

    return res.status(200).json({
      data: {
        user_name: rows[0].user_name,
        user_email: rows[0].email,
        img_url: rows[0].img_url,
        role: rows[0].role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = getUser;
