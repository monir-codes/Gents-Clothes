// JWT authentication disabled for demo purposes (Per User Request to bypass 401).
// The middleware now simply calls next() for every request.
// This file remains for future use but currently does nothing.

const protect = (req, res, next) => {
  next();
};

const admin = (req, res, next) => {
  next();
};

module.exports = { protect, admin };
