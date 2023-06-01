const MedicalSpecialization = require('../models/medicalSpecialization');

class MedicalSpecializationController {
  async createMedicalSpecialization(req, res) {
    try {
      const { name } = req.body;
      const medicalSpecialization = await MedicalSpecialization.create({ name });

      res.status(201).json({ medicalSpecialization });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la especialización médica' });
    }
  }

  async updateMedicalSpecialization(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const medicalSpecialization = await MedicalSpecialization.findByIdAndUpdate(
        id,
        { name },
        { new: true }
      );

      if (!medicalSpecialization) {
        return res.status(404).json({ message: 'Especialización médica no encontrada' });
      }

      res.status(200).json({ medicalSpecialization });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar la especialización médica' });
    }
  }

  async deleteMedicalSpecialization(req, res) {
    try {
      const { id } = req.params;

      const medicalSpecialization = await MedicalSpecialization.findByIdAndDelete(id);

      if (!medicalSpecialization) {
        return res.status(404).json({ message: 'Especialización médica no encontrada' });
      }

      res.status(200).json({ medicalSpecialization });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar la especialización médica' });
    }
  }

  async getMedicalSpecialization(req, res) {
    try {
      const { id } = req.params;

      const medicalSpecialization = await MedicalSpecialization.findById(id);

      if (!medicalSpecialization) {
        return res.status(404).json({ message: 'Especialización médica no encontrada' });
      }

      res.status(200).json({ medicalSpecialization });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener la especialización médica' });
    }
  }

  async getMedicalSpecializations(req, res) {
    try {
      const medicalSpecializations = await MedicalSpecialization.find();

      res.status(200).json( medicalSpecializations );
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las especializaciones médicas' });
    }
  }
}

module.exports = MedicalSpecializationController;
