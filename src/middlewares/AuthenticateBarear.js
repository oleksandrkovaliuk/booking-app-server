const approveAuth = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    req.user = token;
    return next();
  }
  return res.status(401).json({ message: "Not authorized" });
};
