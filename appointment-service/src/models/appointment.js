const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  doctorId: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['booked', 'completed', 'canceled'], default: 'booked' },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
