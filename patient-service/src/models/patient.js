const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  contact: { type: String, required: true },
  emergencyContact: { type: String },
  medicalRecords: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MedicalRecord',
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);
