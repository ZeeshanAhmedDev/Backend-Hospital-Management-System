const Appointment = require('../models/appointment');
const axios = require('axios');

// Validate patient ID by calling Patient Service
const validatePatient = async (patientId) => {
  try {
    const response = await axios.get(`http://patient-service:7001/api/patients/${patientId}`);
    return response.data;
  } catch (err) {
    throw new Error('Invalid patient ID');
  }
};

// Validate doctor ID by calling Staff Service
const validateDoctor = async (doctorId) => {
  try {
    const response = await axios.get(`http://staff-service:8001/api/staff/${doctorId}`);
    return response.data;
  } catch (err) {
    throw new Error('Invalid doctor ID');
  }
};

// Create a new appointment
const createAppointment = async (req, res) => {
  const { patientId, doctorId, date, time, notes } = req.body;

  try {
    // Validate patient and doctor IDs
    const patient = await validatePatient(patientId);
    const doctor = await validateDoctor(doctorId);

    const appointment = new Appointment({
      patientId,
      doctorId,
      date,
      time,
      notes,
    });

    await appointment.save();
    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get appointments by patient ID
const getAppointmentsByPatient = async (req, res) => {
  const { patientId } = req.params;

  try {
    const appointments = await Appointment.find({ patientId });
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an appointment
const mongoose = require('mongoose');

const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { date, time, notes, status } = req.body;

  console.log("Received update request for appointment ID:", id);

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid appointment ID" });
  }

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { date, time, notes, status },
      { new: true } // Return the updated document
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment updated successfully", appointment });
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).json({ error: err.message });
  }
};


// Cancel an appointment
const cancelAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status: 'canceled' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment canceled successfully', appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentsByPatient,
  updateAppointment,
  cancelAppointment,
};
