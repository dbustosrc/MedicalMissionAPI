const mongoose = require('mongoose');
const common = require('../services/common');
const { Schema } = mongoose;

const personSchema = new Schema({
    idNumber: {                 //ID
        type: Number,
        default: 0
    },
    idCardNumber: {             //Número de carné
        type: String,
        unique: true,
        required: true,
        default: 0
    },
    identification: {           //Número de indentificación
        type: String,
        unique: true,
        required: true
    },
    firstname: String,          //Primer nombre
    secondname: String,         //Segundo nombre
    paternallastname: String,   //Apellido parterno
    maternalLastname: String,   //Apellido materno
    gender: {                   //Género
        type: String,
        enum: ['M', 'F'],
        required: true
    },
    ethnicGroup: {              //Grupo étnico
        type: Schema.ObjectId,
        ref: 'EthnicGroup'
    },
    occupation: {               //Ocupación
        type: Schema.ObjectId,
        ref: 'Occupation'
    },
    birthdate: String,          //Fecha de nacimiento
    maritalStatus: {            //Estado civil
        type: String,
        enum: ['STATUS_SINGLE',         //Soltero
            'STATUS_MARRIED',           //Casado
            'STATUS_DIVORCIED',         //Divorciado
            'STATUS_WIDOWED',           //Viudo
            'STATUS_NON-MARITAL-UNION', //Unión de hecho
        ]
    },
    phonenumber: String,        //Número de teléfono
    address: {                  //Dirección
        type: Schema.ObjectId,
        ref: 'Address',
        required: true
    },
    educationalLevel: {         //Nivel de educación
        type: Schema.ObjectId,
        ref: 'EducationalLevel'
    },
    related: {                  //Persona relacionada
        type: Schema.ObjectId,
        ref: 'Person'
    },
    relationship: {             //relación
        type: Schema.ObjectId,
        ref: 'Relationship'
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    image: String               //imagen
});

personSchema.index({ idCardNumber: 1 }, { unique: true });

personSchema.pre('save', async function (next) {
    try {
        const fieldsToCapitalize = ['firstname', 'secondname', 'paternallastname', 'maternalLastname'];

        for (const field of fieldsToCapitalize) {
            if (this[field]) {
                this[field] = await common.capitalLetters(this[field]);
            }
        }

        const result = await common.getNewPersonIdNumber(this.address);
        this.idNumber = result.idNumber;
        this.idCardNumber = result.idCardNumber;
        next();
    } catch (error) {
        next(error);
    }
});

personSchema.pre('findOneAndUpdate', async function (next) {
    try {
        const update = this.getUpdate();
        const fieldsToCapitalize = ['firstname', 'secondname', 'paternallastname', 'maternalLastname'];

        for (const field of fieldsToCapitalize) {
            if (update[field]) {
                update[field] = await common.capitalLetters(update[field]);
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Person', personSchema);