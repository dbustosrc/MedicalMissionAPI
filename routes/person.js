'use strict'

var express = require('../node_modules/express');
var personController = require('../controllers/person');
var md_auth = require('../middlewares/authenticated');
var multipart = require('../node_modules/connect-multiparty');
var md_updload = multipart({ uploadDir: './uploads/persons/' });
var api = express.Router();

api.get('/person/:id', md_auth.ensureAuth, personController.getPerson);
api.get('/person/idCardNumbers/:id?', personController.getPersonIdCards);
api.post('/person', md_auth.ensureAuth, personController.savePerson);
api.get('/persons/page/:page?', md_auth.ensureAuth, personController.getPersonsPaginated);
api.get('/persons', md_auth.ensureAuth, personController.getPersons);
api.put('/person/:id', md_auth.ensureAuth, personController.updatePerson);
api.delete('/person/:id', md_auth.ensureAuth, personController.deletePerson);
api.post('/upload-image-person/:id', [md_auth.ensureAuth, md_updload], personController.uploadImage);
api.get('/get-image-person/:imageFile', personController.getImageFile);

module.exports = api;