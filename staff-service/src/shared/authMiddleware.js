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

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error('JWT invalid', err);
    return res.status(401).json({ message: 'Token is not valid' });
  }

  // DEBUG: log what we got from the token
  console.log('🔒 Authenticated request for userId:', decoded.userId, 'role:', decoded.role);

  req.userId   = decoded.userId;
  req.userRole = decoded.role;
  next();
}

module.exports = authenticate;
