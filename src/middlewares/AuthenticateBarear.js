const jwt = require("jsonwebtoken");
const verificateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized access, no token provided" });
  }

  try {
    const userToken = token.split(" ")[1];
    const decoded = jwt.verify(userToken, process.env.JSON_SECRET);

    if (!decoded) throw Error("Invalid token");

    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = verificateToken;
