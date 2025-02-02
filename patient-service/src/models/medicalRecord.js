const mongoose = require('mongoose');

const MedicalRecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  diagnosis: { type: String, required: true },
  treatment: { type: String, required: true },
  doctor: { type: String, required: true }, // Example: Doctor's name or ID
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema);
