const mongoose = require('mongoose');
const common = require('../services/common');
const { Schema } = mongoose;

const addressSchema = new Schema({
  mainStreet: {
    type: String,
    required: true
  },
  numbering: String,
  intersection: String,
  reference: String,
  postalCode: String,
  city: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  region: {
    type: Schema.ObjectId,
    ref: 'Region',
    required: true
  }
});

addressSchema.index({ mainStreet: 1, numbering: 1, reference: 1, city: 1, district: 1, region: 1, }, { unique: true });

addressSchema.pre('save', async function (next) {
  try {
    const fieldsToCapitalize = ['mainStreet', 'intersection', 'reference'];
    const fieldsToUpperCase = ['numbering', 'postalCode'];

    for (const field of fieldsToCapitalize) {
      if (this[field]) {
        this[field] = common.capitalLetters(this[field]);
      }
    }

    for (const field of fieldsToUpperCase) {
      if (this[field]) {
        this[field] = common.upperCaseLetters(this[field]);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

addressSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const update = this.getUpdate();
    const fieldsToCapitalize = ['mainStreet', 'intersection', 'reference'];
    const fieldsToUpperCase = ['numbering', 'postalCode'];

    for (const field of fieldsToCapitalize) {
      if (update[field]) {
        update[field] = common.capitalLetters(update[field]);
      }
    }

    for (const field of fieldsToUpperCase) {
      if (update[field]) {
        update[field] = common.upperCaseLetters(update[field]);
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});
module.exports = mongoose.model('Address', addressSchema);