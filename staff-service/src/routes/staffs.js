const express = require('express');
const {
  registerStaff,
  loginStaff,
  getStaffProfile,
  updateStaffProfile,
  assignWards,
  manageSchedule,
  admitPatient, getAdmittedPatients
} = require('../controllers/staffController');

const router = express.Router();

// Routes

router.post('/admit', admitPatient);
router.get('/admissions', getAdmittedPatients);


router.post('/register', registerStaff);
router.post('/login', loginStaff);
router.get('/:id', getStaffProfile);
router.put('/:id', updateStaffProfile);
router.put('/:id/assign-wards', assignWards);
router.put('/:id/manage-schedule', manageSchedule);



module.exports = router;
