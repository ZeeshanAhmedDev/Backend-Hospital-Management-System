const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({

      // reference back to Auth-service user
 userId: {
  type: mongoose.Schema.Types.ObjectId,
  required: true,
  unique: true,
  ref: 'User'
 },

  firstName: {
     type: String,
     required: true
  },
    lastName: {
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

  email: { type: String, unique: true, required: true },
  password: { type: String,  },
  role: { type: String, enum: ['Staff','doctor', 'nurse', 'admin'], required: true },


  schedule: [
    {
      date: { type: Date, required: true },
      shift: { type: String, enum: ['morning', 'afternoon', 'night'], required: true },
    },
  ],
  wardsAssigned: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Staff', StaffSchema);
