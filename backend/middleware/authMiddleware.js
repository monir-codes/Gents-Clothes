// JWT authentication disabled for demo purposes (Per User Request to bypass 401).
// The middleware now simply calls next() for every request.
// This file remains for future use but currently does nothing.

const protect = (req, res, next) => {
  // Mock a user to prevent 500 errors on routes that rely on req.user._id
  req.user = {
    _id: '60d5ecb8b392d700153ee61e',
    name: 'Demo Admin',
    email: 'admin@gentfits.com',
    isAdmin: true
  };
  next();
};

const admin = (req, res, next) => {
  next();
};

module.exports = { protect, admin };
