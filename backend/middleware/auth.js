const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
  // 1. Get token from the header
  const token = req.header('x-auth-token');

  // 2. Check if no token is present
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // 3. If token exists, verify it
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user's ID to the request object
    req.user = decoded.user;
    next(); // Move on to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};