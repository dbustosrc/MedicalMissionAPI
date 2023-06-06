const mongoose = require('mongoose');
const common = require('../services/common');
const { Schema } = mongoose;

const countrySchema = new Schema({
  idNumber: {
    type: Number,
    default: 0
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
});

countrySchema.index({ name: 1 }, { unique: true });

countrySchema.pre('save', async function (next) {
  try {
    if (this.name) {
      this.name = await common.capitalLetters(this.name);
    };
    const lastCountry = await mongoose.models['Country'].find().sort({ idNumber: -1 }).limit(1).exec();
    this.idNumber = lastCountry.length ? lastCountry[0].idNumber + 1 : 1;
    next();
  } catch (error) {
    next(error);
  }
});

countrySchema.pre('findOneAndUpdate', async function (next) {
  try {
    const update = this.getUpdate();
    if (update.name) {
      update.name = await common.capitalLetters(update.name);
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Country', countrySchema);