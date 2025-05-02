const express = require('express');
const {
  registerStaff,
  loginStaff,
  getStaffProfile,
  updateStaffProfile,
  assignWards,
  manageSchedule,
  admitPatient, getAdmittedPatients,
  updateAdmission, deleteAdmission,getAdmissionById
} = require('../controllers/staffController');

const router = express.Router();

// Routes
router.get('/admissions/:id', getAdmissionById);
router.post('/admit', admitPatient);
router.get('/admissions', getAdmittedPatients);
router.put('/admissions/:id', updateAdmission);
router.delete('/admissions/:id', deleteAdmission);

router.post('/register', registerStaff);
router.post('/login', loginStaff);
router.get('/:id', getStaffProfile);
router.put('/:id', updateStaffProfile);
router.put('/:id/assign-wards', assignWards);
router.put('/:id/manage-schedule', manageSchedule);



module.exports = router;
