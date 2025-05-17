
const express = require('express');
const authenticate = require('../../src/shared/authMiddleware.js');
const {
  registerStaff,
  getMyStaffProfile,
  getStaffProfile,
  updateStaffProfile,
  assignWards,
  manageSchedule,
  removeShift,
  admitPatient,
  getAdmittedPatients,
  updateAdmission,
  deleteAdmission,
  getAdmissionById,
  getAllStaff,
  removeWard,
} = require('../controllers/staffController');

const router = express.Router();


router.use(authenticate);

// routes
router.get('/me', getMyStaffProfile);
router.get('/all-stuffs', getAllStaff)
router.post('/admit', admitPatient);
router.post('/add-doctor', registerStaff);
router.get('/admissions', getAdmittedPatients);
router.get('/admissions/:id', getAdmissionById);
router.put('/admissions/:id', updateAdmission);
router.delete('/admissions/:id', deleteAdmission);
router.put('/:id/assign-wards', assignWards);
router.put('/:id/remove-shift', removeShift);
router.put('/:id/remove-ward', removeWard)
router.put('/:id/manage-schedule', manageSchedule);
router.put('/:id', updateStaffProfile);

// dynamic route
router.get('/:id', getStaffProfile);

module.exports = router;
