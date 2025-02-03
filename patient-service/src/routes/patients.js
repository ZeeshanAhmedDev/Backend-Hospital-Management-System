const express = require('express');
const {
  registerPatient,
  loginPatient,
  getPatientProfile,
  updatePatientProfile,
  getMedicalRecords,
  createMedicalRecord
} = require('../controllers/patientController');

const router = express.Router();

// Routes
router.post('/register', registerPatient);
router.post('/login', loginPatient);
router.get('/:id', getPatientProfile);
router.put('/:id', updatePatientProfile);
router.get('/:id/medical-records', getMedicalRecords);
router.post('/medicalRecords', createMedicalRecord);

module.exports = router;
