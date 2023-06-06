const express = require('express');
const router = express.Router();
const UsersAllocationController = require('../controllers/usersAllocation');
const md_auth = require('../middlewares/authenticated');

const controller = new UsersAllocationController();

// Ruta para crear una nueva asignación de usuarios
router.post('/users-allocations', md_auth.ensureAuth, controller.createUsersAllocation);

// Ruta para actualizar una asignación de usuarios existente
router.put('/users-allocations/:id', md_auth.ensureAuth, controller.updateUsersAllocation);

// Ruta para eliminar una asignación de usuarios existente
router.delete('/users-allocations/:id', md_auth.ensureAuth, controller.deleteUsersAllocation);

// Ruta para obtener información de una asignación de usuarios específica
router.get('/users-allocations/:id', md_auth.ensureAuth, controller.getUsersAllocation);

// Ruta para obtener todas las asignaciones de usuarios
router.get('/users-allocations', md_auth.ensureAuth, controller.getUsersAllocations);

// Ruta para obtener las asignaciones de usuarios según período
router.get('/users-allocations/period/:period/user/:user', md_auth.ensureAuth, controller.getPeriodUsersAllocations);

module.exports = router;
