const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['doctor', 'nurse', 'admin'], required: true },
  schedule: [
    {
      date: { type: Date, required: true },
      shift: { type: String, enum: ['morning', 'afternoon', 'night'], required: true },
    },
  ],
  wardsAssigned: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Staff', StaffSchema);
