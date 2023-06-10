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
      updateData._id = req.params.id;
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

      const result = await Appointment.find({
        period: period,
        medicalSpecialization: specialty,
        attentionDate: date,
        status: { $ne: 'STATUS_ON-HOLD' }
      })
        .sort({ confirmationNumber: 1 })
        .populate('person')
        .exec();

      const formattedResult = await Promise.all(result.map(async appointment => {
        const {
          _id,
          number,
          confirmationNumber,
          person: { firstname, secondname, paternallastname, maternalLastname },
          person: { idCardNumber, _id: personId, identification },
          attentionDate,
          status,
          observation
        } = appointment;
        const personName = `${firstname} ${secondname} ${paternallastname} ${maternalLastname}`;
        let otherAppointments = [];
        if (status === 'STATUS_CONFIRMED') {
          otherAppointments = await Appointment.find({
            period: period,
            person: personId,
            attentionDate: date,
            status: { $nin: ['STATUS_ON-HOLD'] },
            _id: { $ne: _id }
          }).sort('confirmationNumber')
            .populate('medicalSpecialization')
            .lean()
            .exec();
        }

        return {
          _id,
          identification,
          number,
          confirmationNumber,
          idCardNumber,
          personName,
          attentionDate,
          status,
          observation,
          otherAppointments: otherAppointments.map(({
            _id,
            medicalSpecialization: { name: medicalSpecializationName },
            attentionDate,
            status }) => ({
              _id,
              medicalSpecializationName,
              attentionDate,
              status
            }))
        };
      }));

      let counter = 1;
      formattedResult.forEach(appointment => {
        if (appointment.status === 'STATUS_CONFIRMED') {
          appointment.position = counter++;
        } else {
          appointment.position = null;
        }
      });

      res.json(formattedResult);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPeriodAppointmentsByDate(req, res) {
    try {
      const { period, date } = req.params;

      const result = await Appointment.find({
        period: period,
        attentionDate: date,
        status: { $ne: 'STATUS_ON-HOLD' }
      })
        .sort('confirmationNumber')
        .populate('person')
        .populate('medicalSpecialization')
        .exec();

      let counter = 1;
      let position = 0;
      const formattedResult = result.map(appointment => {
        const {
          _id,
          number,
          person: { firstname, secondname, paternallastname, maternalLastname },
          person: { idCardNumber, identification },
          attentionDate,
          medicalSpecialization: { name: medicalSpecializationName },
          status,
          observation
        } = appointment;
        const personName = `${firstname} ${secondname} ${paternallastname} ${maternalLastname}`;
        if (status === 'STATUS_PRESCRIBED') {
          position = counter++;
        }
        return {
          _id,
          position: position === 0 ? null : position,
          number,
          idCardNumber,
          identification,
          personName,
          attentionDate,
          medicalSpecializationName,
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
        .sort('attentionDate')
        .populate('period')
        .populate('medicalSpecialization')
        .exec();

      const formattedResult = result.map(appointment => {
        const {
          _id,
          number,
          attentionDate,
          status,
          observation,
          period: { name: periodName },
          medicalSpecialization: { name: medicalSpecializationName }
        } = appointment;

        return {
          _id,
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

  async getPeriodAppointmentsByDateUnfiltered(req, res) {
    try {
      const { period, date } = req.params;

      const result = await Appointment.find({
        period: period,
        attentionDate: date
      })
        .sort('number')
        .populate('person')
        .populate('medicalSpecialization')
        .exec();

      const formattedResult = result.map(appointment => {
        const {
          _id,
          number,
          person: {
            firstname,
            secondname,
            paternallastname,
            maternalLastname,
            idCardNumber,
            _id: personId
          },
          medicalSpecialization: { name: medicalSpecializationName },
          status
        } = appointment;
        const personName = `${firstname} ${secondname} ${paternallastname} ${maternalLastname}`;
        return {
          _id,
          number,
          personId,
          idCardNumber,
          personName,
          medicalSpecializationName,
          status
        };
      });
      res.json(formattedResult);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las citas' });
    }
  }


}

module.exports = AppointmentController;
