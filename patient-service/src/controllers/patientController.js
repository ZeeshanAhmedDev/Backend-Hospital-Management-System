const mongoose = require('mongoose');
const Patient = require('../models/patient');
const MedicalRecord = require('../models/medicalRecord.js'); 
const bcrypt = require('bcryptjs');


// Register a new patient
const registerPatient = async (req, res) => {
  const { name, email, password, age, contact, emergencyContact } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = new Patient({
      name,
      email,
      password: hashedPassword,
      age,
      contact,
      emergencyContact,
    });

    await patient.save();
    res.status(201).json({ message: 'Patient registered successfully', patient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login a patient
const loginPatient = async (req, res) => {
  const { email, password } = req.body;

  try {
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', patient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get patient profile
const getPatientProfile = async (req, res) => {
  const { id } = req.params;

   // ✅ Validate if ID is a valid ObjectId
   if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid patient ID' });
  }

  try {
    const patient = await Patient.findById(id).populate('medicalRecords');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update patient profile
const updatePatientProfile = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const patient = await Patient.findByIdAndUpdate(id, updates, { new: true });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json({ message: 'Profile updated successfully', patient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Push the new record into the patient's medicalRecords.
const createMedicalRecord = async (req, res) => {
  const { patientId, diagnosis, treatment, doctor } = req.body;

  try {
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const newRecord = new MedicalRecord({ patient: patientId, diagnosis, treatment, doctor });
    await newRecord.save();

    patient.medicalRecords.push(newRecord._id);
    await patient.save();

    res.status(201).json({ message: 'Medical record added successfully', newRecord });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// View medical records for a specific patient
const getMedicalRecords = async (req, res) => {
  const { id } = req.params;

  try {
    const medicalRecords = await MedicalRecord.find({ patient: id });
    if (!medicalRecords.length) {
      return res.status(404).json({ message: 'No medical records found for this patient' });
    }
    res.status(200).json(medicalRecords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  registerPatient,
  loginPatient,
  getPatientProfile,
  updatePatientProfile,
  getMedicalRecords,
  createMedicalRecord
};
