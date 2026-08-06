// JWT authentication disabled for demo purposes.
// The middleware now simply calls next() for every request.
// This file remains for future use but currently does nothing.

const protect = (req, res, next) => {
  // No token verification – allow all requests.
  next();
};

const admin = (req, res, next) => {
  // No admin check – allow all requests.
  next();
};

module.exports = { protect, admin };
