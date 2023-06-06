const mongoose = require('mongoose');
const common = require('../services/common');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phonenumber: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['ROLE_USER', 'ROLE_ADMIN'],
        default: 'ROLE_USER'
    },
    image: {
        type: String
    }
});

userSchema.pre('save', async function (next) {
    try {
        const fieldsToCapitalize = ['name', 'surname'];
        const fieldsToLowerCase = ['email'];

        for (const field of fieldsToCapitalize) {
            if (this[field]) {
                this[field] = await common.capitalLetters(this[field]);
            }
        }

        for (const field of fieldsToLowerCase) {
            if (this[field]) {
                this[field] = await common.lowerCaseLetters(this[field]);
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.pre('findOneAndUpdate', async function (next) {
    try {
        const update = this.getUpdate();
        const fieldsToCapitalize = ['name', 'surname'];
        const fieldsToLowerCase = ['email'];

        for (const field of fieldsToCapitalize) {
            if (update[field]) {
                update[field] = await common.capitalLetters(update[field]);
            }
        }

        for (const field of fieldsToLowerCase) {
            if (update[field]) {
                update[field] = await common.lowerCaseLetters(update[field]);
            }
        }
    } catch (error) {
        next(error);
    }
});


module.exports = mongoose.model('User', userSchema);