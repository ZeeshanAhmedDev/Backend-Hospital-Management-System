// const express = require('express');
// const {
//   registerStaff,
//   loginStaff,
//   getStaffProfile,
//   updateStaffProfile,
//   assignWards,
//   manageSchedule,
//   admitPatient, getAdmittedPatients,
//   updateAdmission, deleteAdmission,getAdmissionById
// } = require('../controllers/staffController');

// const router = express.Router();

// // Routes
// router.get('/admissions/:id', getAdmissionById);
// router.post('/admit', admitPatient);
// router.get('/admissions', getAdmittedPatients);
// router.put('/admissions/:id', updateAdmission);
// router.delete('/admissions/:id', deleteAdmission);

// router.post('/register', registerStaff);
// router.post('/login', loginStaff);
// router.get('/:id', getStaffProfile);
// router.put('/:id', updateStaffProfile);
// router.put('/:id/assign-wards', assignWards);
// router.put('/:id/manage-schedule', manageSchedule);



// module.exports = router;


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

// Protect every route 
router.use(authenticate);


router.get('/me', getMyStaffProfile);

// still allow fetching any staff by :id for admins
router.get('/:id', getStaffProfile);


// Other protected endpoints
router.put('/:id', updateStaffProfile);
router.put('/:id/assign-wards', assignWards);
router.put('/:id/manage-schedule', manageSchedule);

router.post('/admit', admitPatient);
router.get('/admissions', getAdmittedPatients);
router.get('/admissions/:id', getAdmissionById);
router.put('/admissions/:id', updateAdmission);
router.delete('/admissions/:id', deleteAdmission);

module.exports = router;
