const jwt = require("jsonwebtoken");
const verificateToken = (req, res, next) => {
  const incomingToken = req.headers.authorization.split(" ")[1];
  try {
    if (incomingToken) {
      const decoded = jwt.verify(incomingToken, process.env.JSON_SECRET);
      if (!decoded) throw Error("Invalid token");
      return next();
    }
  } catch (error) {
    return res.status(401).json({ message: error || "Not authorized" });
  }
};

module.exports = verificateToken;
