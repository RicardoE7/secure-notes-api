const jwt = require("jsonwebtoken");

const expiration = "2h";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "You must be logged in to do that.",
    });
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      message: "You must be logged in to do that.",
    });
  }

  try {
    const { data } = jwt.verify(token, process.env.JWT_SECRET, {
      maxAge: expiration,
    });

    req.user = data;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
}

function signToken({ username, email, _id }) {
  const payload = {
    username,
    email,
    _id,
  };

  return jwt.sign(
    {
      data: payload,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: expiration,
    },
  );
}

module.exports = {
  authMiddleware,
  signToken,
};
