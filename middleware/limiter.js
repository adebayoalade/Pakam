const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message:
    "You cant sign up again Too many requests from this IP, please try again after 15 mins",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;