
const express = require('express');
const authenticate = require('../../src/shared/authMiddleware.js');
const {
  getMyStaffProfile,
  getStaffProfile,
  updateStaffProfile,
  assignWards,
  manageSchedule,
  admitPatient,
  getAdmittedPatients,
  updateAdmission,
  deleteAdmission,
  getAdmissionById,
} = require('../controllers/staffController');

const router = express.Router();


router.use(authenticate);

// routes
router.get('/me', getMyStaffProfile);
router.post('/admit', admitPatient);
router.get('/admissions', getAdmittedPatients);
router.get('/admissions/:id', getAdmissionById);
router.put('/admissions/:id', updateAdmission);
router.delete('/admissions/:id', deleteAdmission);
router.put('/:id/assign-wards', assignWards);
router.put('/:id/manage-schedule', manageSchedule);
router.put('/:id', updateStaffProfile);

// dynamic route
router.get('/:id', getStaffProfile);

module.exports = router;
