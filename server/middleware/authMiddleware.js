const jwt = require("jsonwebtoken");

module.exports = (role) => (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  const decoded = jwt.verify(token, "secret");
  if (role && decoded.role !== role) return res.sendStatus(403);

  req.user = decoded;
  next();
};