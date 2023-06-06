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

  async getPeriodAppointmentsByMedicalSpecialty(req, res) {
    try {
      const { period, specialty, date } = req.params;
      console.log(period, specialty, date);

      const result = await Appointment.find({
        period: period,
        medicalSpecialization: specialty,
        attentionDate: date
      })
        .sort('number')
        .populate('person')
        .exec();

      const formattedResult = result.map(appointment => {
        const {
          _id,
          number,
          person: { firstname, secondname, paternallastname, maternalLastname },
          attentionDate,
          status,
          observation
        } = appointment;
        const personName = `${firstname} ${secondname} ${paternallastname} ${maternalLastname}`;
        return {
          _id,
          number,
          personName,
          attentionDate,
          status,
          observation
        };
      });
      res.json(formattedResult);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las citas' });
    }
  }

  async getPeriodAppointmentsByPerson(req, res) {
    try {
      const { period, person } = req.params;

      const result = await Appointment.find({
        period: period,
        person: person
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
