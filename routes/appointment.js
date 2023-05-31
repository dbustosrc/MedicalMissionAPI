const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/appointment');
const md_auth = require('../middlewares/authenticated');

const appointmentController = new AppointmentController();

// Ruta para crear una cita
router.post('/appointments', md_auth.ensureAuth, appointmentController.createAppointment);

// Ruta para actualizar una cita
router.put('/appointments/:id', md_auth.ensureAuth, appointmentController.updateAppointment);

// Ruta para eliminar una cita
router.delete('/appointments/:id', md_auth.ensureAuth, appointmentController.deleteAppointment);

// Ruta para obtener una cita por su ID
router.get('/appointments/:id', md_auth.ensureAuth, appointmentController.getAppointment);

// Ruta para obtener todas las citas
router.get('/appointments', md_auth.ensureAuth, appointmentController.getAppointments);

router.get('/appointments/getAppointmentsByParams', md_auth.ensureAuth, appointmentController.getAppointmentsByParams);

module.exports = router;
