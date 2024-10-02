const jwt = require("jsonwebtoken");
const db = require("../../config/database");

const updateTokensBlackList = async (req, res) => {
  try {
    await db.query("INSERT INTO tokens_black_list (token) VALUES ($1)", [
      jwt.sign(req.token, process.env.JSON_SECRET),
    ]);

    return res.status(200).json({ message: "Token added to blacklist" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = updateTokensBlackList;
