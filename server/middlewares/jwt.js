const jwt = require("jsonwebtoken");

const jwtAuthMiddleWare = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "Token missing" });

  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.jwtPayload = decoded; // { id, email }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });
};

module.exports = {
  jwtAuthMiddleWare,
  generateToken
};
