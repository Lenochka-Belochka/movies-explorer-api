const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 10000,
  max: 100,
});

module.exports = rateLimiter;
