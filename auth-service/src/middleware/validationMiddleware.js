
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};


const validateRegister = (req, res, next) => {
    const { firstName, lastName, phoneNumber, email, password, confirmPassword, role } = req.body;
  
    if (!firstName || !lastName || !phoneNumber || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
  
    next();
  };


module.exports = { authenticate, validateRegister };

  