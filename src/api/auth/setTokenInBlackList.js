const db = require("../../config/database");

const setTokenInBlackList = async (req, res) => {
  const userToken = req.headers.authorization.split(" ")[1];

  try {
    await db.query("INSERT INTO tokens_black_list (token) VALUES ($1)", [
      userToken,
    ]);

    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};

module.exports = setTokenInBlackList;
