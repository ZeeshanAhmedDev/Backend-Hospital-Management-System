const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String },
  role: { type: String, enum: ['Patient', 'Staff'], required: true }, // Role can be either Patient or Staff

  resetPasswordToken: String,
  resetPasswordExpire: Date
  
});

module.exports = mongoose.model('User', userSchema);
