const Appointment = require('../models/appointment');

class AppointmentController {
  // Crear una cita
  async createAppointment(req, res) {
    try {
      const appointmentData = req.body;
      const appointment = new Appointment(appointmentData);
      const savedAppointment = await appointment.save();
      res.status(200).json(savedAppointment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Actualizar una cita por su ID
  async updateAppointment(req, res) {
    try {
      const appointmentId = req.params.id;
      const updateData = req.body;
      const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentId, updateData, { new: true });
      if (updatedAppointment) {
        res.status(200).json(updatedAppointment);
      } else {
        res.status(404).json({ error: 'No se encontró la cita' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la cita' });
    }
  }

  // Eliminar una cita por su ID
  async deleteAppointment(req, res) {
    try {
      const appointmentId = req.params.id;
      const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);
      if (deletedAppointment) {
        res.status(200).json(deletedAppointment);
      } else {
        res.status(404).json({ error: 'No se encontró la cita' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la cita' });
    }
  }

  // Obtener una cita por su ID
  async getAppointment(req, res) {
    try {
      const appointmentId = req.params.id;
      const appointment = await Appointment.findById(appointmentId);
      if (appointment) {
        res.status(200).json(appointment);
      } else {
        res.status(404).json({ error: 'No se encontró la cita' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la cita' });
    }
  }

  // Obtener todas las citas
  async getAppointments(req, res) {
    try {
      const appointments = await Appointment.find();
      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las citas' });
    }
  }

  async getAppointmentsByParams(req, res) {
  try {
    const appointmentParams = req.body;
    const result = await Appointment.find({
      period: appointmentParams.period,
      person: appointmentParams.person
    })
      .sort('medicalSpecialization')
      .populate('period')
      .populate('medicalSpecialization')
      .exec();

    const formattedResult = result.map(appointment => {
      const {
        number,
        attentionDate,
        status,
        observation,
        period: { name: periodName },
        medicalSpecialization: { name: medicalSpecializationName }
      } = appointment;

      return {
        number,
        attentionDate,
        status,
        observation,
        periodName,
        medicalSpecializationName
      };
    });

    res.json(formattedResult);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las citas' });
  }
}
  

}

module.exports = AppointmentController;
