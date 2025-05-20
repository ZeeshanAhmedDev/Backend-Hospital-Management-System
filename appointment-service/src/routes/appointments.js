const express = require('express');
const {
  createAppointment,
  getAllAppointments,
  getAppointmentsByPatient,
  updateAppointment,
  cancelAppointment,
} = require('../controllers/appointmentController');



const router = express.Router();

// Routes
router.post('/', createAppointment);
router.get('/', getAllAppointments);
router.get('/patient/:patientId', getAppointmentsByPatient);
router.patch('/:id', cancelAppointment);
router.put('/:id', updateAppointment);

module.exports = router;