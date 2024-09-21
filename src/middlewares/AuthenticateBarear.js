const jwt = require("jsonwebtoken");
const verificateToken = (req, res, next) => {
  const userToken = req.headers.authorization.split(" ")[1];
  try {
    if (userToken) {
      const decoded = jwt.verify(userToken, process.env.JSON_SECRET);
      if (!decoded) throw Error("Invalid token");
      return next();
    }
  } catch (error) {
    return res.status(401).json({ message: error || "Not authorized" });
  }
};

module.exports = verificateToken;
