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

// Ruta para obtener citas por parámetros
router.get('/appointments/period/:period/person/:person', md_auth.ensureAuth, appointmentController.getPeriodAppointmentsByPerson);

// Ruta para obtener citas por parámetros
router.get('/appointments/period/:period/medical-specialty/:specialty/attention-date/:date', md_auth.ensureAuth, appointmentController.getPeriodAppointmentsByMedicalSpecialty);

router.get('/appointments/period/:period/attention-date/:date', md_auth.ensureAuth, appointmentController.getPeriodAppointmentsByDate);

module.exports = router;
