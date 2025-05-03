const mongoose = require('mongoose');

const AdmissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  phone: { type: String, required: true },
  ward: { type: String, required: true },
  bed: { type: String, required: true },
  condition: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Admission', AdmissionSchema);
