// authMiddleware.js
const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

function authenticate(req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.userEmail = decoded.email;
    req.userFirst = decoded.firstName;
    req.userLast = decoded.lastName;
    req.userPhone = decoded.phoneNumber;
    req.userAddress = decoded.address;
    next();
  } catch (err) {
    console.error('JWT invalid', err);
    return res.status(401).json({ message: 'Token is not valid' });
  }
}

module.exports = authenticate;
