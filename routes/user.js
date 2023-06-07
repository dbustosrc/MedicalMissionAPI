'use strict'

var express = require('../node_modules/express');
var userController = require('../controllers/user');
var md_auth = require('../middlewares/authenticated');
var multipart = require('../node_modules/connect-multiparty');
var md_updload = multipart({ uploadDir: './uploads/users/' });
var api = express.Router();

api.post('/registerUser', userController.saveUser);
api.post('/loginUser', userController.loginUser);
api.put('/updateUser/:id', md_auth.ensureAuth, userController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_updload], userController.uploadImage);
api.get('/get-image-user/:imageFile', userController.getImageFile);
api.get('/users/:id', md_auth.ensureAuth, userController.getUser);
api.get('/users', md_auth.ensureAuth, userController.getUsers);

// Ruta para actualizar la contraseña
api.put('/users/password', md_auth.ensureAuth , userController.updatePassword);

module.exports = api;