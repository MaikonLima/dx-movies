module.exports = {
  jwtSecret: process.env.JWT_SECRET || "SECRET_KEY",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
};
