const express = require('express');
const {
  registerStaff,
  loginStaff,
  getStaffProfile,
  updateStaffProfile,
  assignWards,
  manageSchedule,
} = require('../controllers/staffController');

const router = express.Router();

// Routes
router.post('/register', registerStaff);
router.post('/login', loginStaff);
router.get('/:id', getStaffProfile);
router.put('/:id', updateStaffProfile);
router.put('/:id/assign-wards', assignWards);
router.put('/:id/manage-schedule', manageSchedule);

module.exports = router;
