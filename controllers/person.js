'use strict'

const Person = require('../models/person');
const Address = require('../models/address');
const Region = require('../models/region');
const Country = require('../models/country');

const mongoosePagination = require('../node_modules/mongoose-pagination')
const fs = require('fs');
const path = require('path');

async function getPerson(req, res) {
    try {
        const personId = req.params.id;

        const personFound = await Person.findById(personId).exec();
        if (!personFound) {
            return res.status(500).send({ error: 'Persona no existe' });
        }

        return res.status(200).send( personFound );
    } catch (err) {
        console.log(err);
        return res.status(500).send({ error: 'Error en la petición' });
    }
}

async function getPersons(req, res) {
    try {
        const persons = await Person.find();
        res.status(200).json(persons);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las personas' });
    }
}

async function getPersonIdCards(req, res) {
    try {
        const result = await Person.find()
            .sort('creationDate')
            .populate({
                path: 'address',
                populate: {
                    path: 'region',
                    populate: {
                        path: 'country'
                    }
                }
            })
            .exec();

        const formattedResult = result.map(person => {
            const {
                //identification,
                idCardNumber,
                firstname,
                secondname,
                paternallastname,
                maternalLastname,
                birthdate
            } = person;
            const districtName = person.address.district;
            const cityName = person.address.city;
            const regionName = person.address.region.name;
            const countryName = person.address.region.country.name;
            return {
                //identification,
                idCardNumber,
                firstname,
                secondname,
                paternallastname,
                maternalLastname,
                birthdate,
                districtName,
                cityName,
                regionName,
                countryName
            };
        });
        res.json(formattedResult);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving idCards', error });
    }
}

async function getPersonsPaginated(req, res) {
    try {
        const page = req.params.page ? req.params.page : 1;
        const itemsPerPage = 4;

        const totalItems = await Person.countDocuments();

        const result = await Person.find()
            .sort('paternallastname')
            .paginate(page, itemsPerPage)
            .exec();

        if (!result) {
            return res.status(500).send({ error: 'No existen personas en la base de datos' });
        }

        return res.status(200).send({
            totalItems: totalItems,
            persons: result
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ error: err.message });
    }
}

async function savePerson(req, res) {
    try {
        console.log(req.body);
        const personData = req.body;
        const person = new Person(personData);
        const savedPerson = await person.save();
        res.status(200).json(savedPerson);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updatePerson(req, res) {
    try {
        const personId = req.params.id;
        const update = req.body;

        const personUpdated = await Person.findByIdAndUpdate(personId, update, { new: true });

        if (!personUpdated) {
            return res.status(500).send({ error: 'No se ha podido actualizar la persona' });
        }

        return res.status(200).send({ personUpdated });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ error: err.message });
    }
}

async function deletePerson(req, res) {
    try {
        const personId = req.params.id;

        const personRemoved = await Person.findByIdAndRemove(personId);

        if (!personRemoved) {
            return res.status(500).send({ error: 'No se ha podido eliminar la persona' });
        }

        return res.status(200).send({ personRemoved });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ error: err.message });
    }
}

async function uploadImage(req, res) {
    try {
        const personId = req.params.id;
        let filename = 'No subido...';

        if (!req.files) {
            return res.status(500).send({ error: 'No ha subido ninguna imagen' });
        }

        const filepath = req.files.image.path;
        filename = filepath.split(/[\\/]/).pop();

        const filenamesplit = filename.split('.');
        const fileext = filenamesplit[1];

        if (fileext !== 'png' && fileext !== 'jpg' && fileext !== 'gif') {
            return res.status(500).send({ error: 'Extensión del archivo no válida' });
        }

        const personUpdated = await Person.findByIdAndUpdate(personId, { image: filename }, { new: true });

        if (!personUpdated) {
            return res.status(500).send({ error: 'No se ha podido actualizar la persona' });
        }

        return res.status(200).send({ person: personUpdated });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ error: err.message });
    }
}

function getImageFile(req, res) {
    const imageFile = req.params.imageFile;
    const filePath = path.resolve('./uploads/persons/', imageFile);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(500).send({ error: 'La imagen no existe' });
        }

        res.sendFile(filePath);
    });
}

module.exports = {
    getPerson,
    getPersonIdCards,
    savePerson,
    getPersons,
    getPersonsPaginated,
    updatePerson,
    deletePerson,
    uploadImage,
    getImageFile
}