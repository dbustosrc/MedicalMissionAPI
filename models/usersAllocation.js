const mongoose = require('mongoose');
const { Schema } = mongoose;

const usersAllocationSchema = new Schema({
    period: {
        type: Schema.ObjectId,
        ref: 'Period',
        required: true
    },
    medicalSpecialization: {
        type: Schema.ObjectId,
        ref: 'MedicalSpecialization'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    pharmacist: {
        type: Boolean,
        required: true,
        default: false
    },
    triage: {
        type: Boolean,
        required: true,
        default: false
    },
});

usersAllocationSchema.index({ period: 1, medicalSpecialization: 1, user: 1, pharmacist:1, triage:1 }, { unique: true });

usersAllocationSchema.pre('save', async function (next) {
    try {
        if (this.medicalSpecialization){    //No puede tener asignación a farmacia si tiene clínica también
            this.pharmacist = false;
            this.triage = false;
        }
        if (this.triage == true){    //No puede tener asignación a farmacia si tiene triage también
            this.pharmacist = false;
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('UsersAllocation', usersAllocationSchema);
