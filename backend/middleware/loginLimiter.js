const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15, // 15 requêtes max par fenêtre
  message: "Too many login attempts, please try again later.",
});

module.exports = loginLimiter;
