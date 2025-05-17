const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const StaffSchema = new mongoose.Schema({

  // reference back to Auth-service user
  userId: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4(),
  },

  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String
  },
  address: {
    type: String
  },
  role: { type: String, enum: ['Staff', 'doctor', 'nurse', 'admin'], required: true },


  schedule: [
    {
      date: { type: Date, required: true },
      shift: { type: String, enum: ['morning', 'afternoon', 'night'], required: true },
    },
  ],
  wardsAssigned: [{ type: String }],
},
  { timestamps: true });

module.exports = mongoose.model('Staff', StaffSchema);
