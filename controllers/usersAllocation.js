const UsersAllocation = require('../models/usersAllocation');

class UsersAllocationController {
  // Método para crear una nueva asignación de usuarios
  async createUsersAllocation(req, res) {
    try {
      const { period, medicalSpecialization, user, pharmacist, triage } = req.body;

      // Crear una nueva instancia de UsersAllocation con los datos recibidos
      const usersAllocation = new UsersAllocation({
        period,
        medicalSpecialization,
        user,
        pharmacist,
        triage
      });

      // Guardar la asignación de usuarios en la base de datos
      const createdAllocation = await usersAllocation.save();

      res.status(201).json(createdAllocation);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la asignación de usuarios' });
    }
  }

  // Método para actualizar una asignación de usuarios existente
  async updateUsersAllocation(req, res) {
    try {
      const { id } = req.params;
      const { period, medicalSpecialization, user, pharmacist, triage } = req.body;

      // Buscar la asignación de usuarios por su ID y actualizar sus datos
      const updatedAllocation = await UsersAllocation.findByIdAndUpdate(
        id,
        { period, medicalSpecialization, user, pharmacist, triage },
        { new: true }
      );

      if (!updatedAllocation) {
        return res.status(404).json({ error: 'Asignación de usuarios no encontrada' });
      }

      res.json(updatedAllocation);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la asignación de usuarios' });
    }
  }

  // Método para eliminar una asignación de usuarios existente
  async deleteUsersAllocation(req, res) {
    try {
      const { id } = req.params;

      // Buscar la asignación de usuarios por su ID y eliminarla
      const deletedAllocation = await UsersAllocation.findByIdAndRemove(id);

      if (!deletedAllocation) {
        return res.status(404).json({ error: 'Asignación de usuarios no encontrada' });
      }

      res.json(deletedAllocation);
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la asignación de usuarios' });
    }
  }

  // Método para obtener información de una asignación de usuarios específica
  async getUsersAllocation(req, res) {
    try {
      const { id } = req.params;

      // Buscar la asignación de usuarios por su ID
      const allocation = await UsersAllocation.findById(id);

      if (!allocation) {
        return res.status(404).json({ error: 'Asignación de usuarios no encontrada' });
      }

      res.json(allocation);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la asignación de usuarios' });
    }
  }

  // Método para obtener todas las asignaciones de usuarios
  async getUsersAllocations(req, res) {
    try {
      // Obtener todas las asignaciones de usuarios
      const allocations = await UsersAllocation.find();

      res.json(allocations);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las asignaciones de usuarios' });
    }
  }

  async getPeriodUsersAllocations(req, res) {
    try {
      const { period, user } = req.params;

      // Obtener todas las asignaciones de usuarios
      const result = await UsersAllocation.find({ period: period, user: user }).populate('medicalSpecialization').exec();

      const formattedResult = result.map(allocation => {
        const {
          _id,
          period,
          medicalSpecialization,
          pharmacist,
          triage
        } = allocation;
        let medicalSpecializationId = null;
        let medicalSpecializationName = '';
        if (medicalSpecialization) {
          medicalSpecializationId = medicalSpecialization._id;
          medicalSpecializationName = medicalSpecialization.name;
        } else {
          if (triage === true) {
            medicalSpecializationName = 'Triage';
          } else if (pharmacist === true) {
            medicalSpecializationName = 'Pharmacy';
          }
        }
        return {
          _id,
          period,
          medicalSpecializationId,
          medicalSpecializationName,
          pharmacist,
          triage
        };
      });

      res.json(formattedResult);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UsersAllocationController;
