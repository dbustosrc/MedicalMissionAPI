const mongoose = require('mongoose');
const { Schema } = mongoose;
const common = require('../services/common');
const currentDate = new Date();

const appointmentSchema = new Schema({
    period: {
        type: Schema.ObjectId,
        ref: 'Period',
        required: true
    },
    medicalSpecialization: {
        type: Schema.ObjectId,
        ref: 'MedicalSpecialization',
        required: true
    },
    person: {
        type: Schema.ObjectId,
        ref: 'Person',
        required: true
    },
    number: {
        type: Number
    },
    confirmationNumber: {
        type: Number
    },
    attentionDate: {
        type: Date,
        required: true
    },
    status: {                           //Estado de la cita
        type: String,
        enum: ['STATUS_ON-HOLD',            //En cola
            'STATUS_CONFIRMED',             //Confirmada
            'STATUS_CONFIRMED_ARCHIVED',    //Archivada
            'STATUS_PRESCRIBED',            //Recetada
            'STATUS_PRESCRIBED_ARCHIVED',   //Archivada
            'STATUS_ATTENDED',              //Atendida
            'STATUS_NOT-ATTENDED',          //Sin atenderse
        ],
        default: 'STATUS_ON-HOLD'
    },
    observation: {
        type: String
    },
    onHoldUpdate: {
        type: Date
    },
    confirmedUpdate: {
        type: Date
    },
    confirmedArchivedUpdate: {
        type: Date
    },
    prescribedUpdate: {
        type: Date
    },
    prescribedArchivedUpdate: {
        type: Date
    },
    attendedUpdate: {
        type: Date
    },
    notAttendedUpdate: {
        type: Date
    }
});

appointmentSchema.index({ period: 1, medicalSpecialization: 1, person: 1 }, { unique: true });

appointmentSchema.pre('save', async function (next) {
    try {
        switch (this.status) {
            case 'STATUS_ON-HOLD':
                this.onHoldUpdate = currentDate;
                break;
            case 'STATUS_CONFIRMED':
                this.confirmedUpdate = currentDate;
                break;
            case 'STATUS_CONFIRMED_ARCHIVED':
                this.confirmedArchivedUpdate = currentDate;
                break;
            case 'STATUS_PRESCRIBED':
                this.prescribedUpdate = currentDate;
                break;
            case 'STATUS_PRESCRIBED_ARCHIVED':
                this.prescribedArchivedUpdate = currentDate;
                break;
            case 'STATUS_ATTENDED':
                this.attendedUpdate = currentDate;
                break;
            case 'STATUS_NOT-ATTENDED':
                this.notAttendedUpdate = currentDate;
                break;
        }
        if (this.observation) {
            this.observation = await common.lowerCaseLetters(this.observation);
        };
        const lastAppointment = await mongoose.models['Appointment'].find({ period: this.period }).sort({ number: -1 }).limit(1).exec();
        this.number = lastAppointment.length ? lastAppointment[0].number + 1 : 1;
        console.log(this.number);
        next();
    } catch (error) {
        next(error);
    }
});

appointmentSchema.pre('findOneAndUpdate', async function (next) {
    try {
        const update = this.getUpdate();
        switch (update.status) {
            case 'STATUS_ON-HOLD':
                update.onHoldUpdate = currentDate;
                break;
            case 'STATUS_CONFIRMED':
                update.confirmedUpdate = currentDate;
                const currentAppointment = await mongoose.models['Appointment'].findById(update._id);
                if (!currentAppointment.confirmationNumber){
                    const lastAppointment = await mongoose.models['Appointment'].find({ period: currentAppointment.period, confirmationNumber: { $ne: null } }).sort({ confirmationNumber: -1 }).limit(1).exec();
                    update.confirmationNumber = lastAppointment.length ? lastAppointment[0].confirmationNumber + 1 : 1;
                }
                break;
            case 'STATUS_CONFIRMED_ARCHIVED':
                update.confirmedArchivedUpdate = currentDate;
                break;
            case 'STATUS_PRESCRIBED':
                update.prescribedUpdate = currentDate;
                break;
            case 'STATUS_PRESCRIBED_ARCHIVED':
                update.prescribedArchivedUpdate = currentDate;
                break;
            case 'STATUS_ATTENDED':
                update.attendedUpdate = currentDate;
                break;
            case 'STATUS_NOT-ATTENDED':
                update.notAttendedUpdate = currentDate;
                break;
        }
        if (update.observation) {
            update.observation = await common.lowerCaseLetters(update.observation);
        };
        
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Appointment', appointmentSchema);