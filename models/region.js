const mongoose = require('mongoose');
const common = require('../services/common');

const { Schema } = mongoose;

const regionSchema = new Schema({
  idNumber: {
    type: Number,
    default: 9
  },
  name: {
    type: String,
    required: true
  },
  country: {
    type: Schema.ObjectId,
    ref: 'Country',
    required: true
  }
});

regionSchema.index({ name: 1, country: 1 }, { unique: true });

regionSchema.pre('save', async function (next) {
  try {
    if (this.name) {
      this.name = await common.capitalLetters(this.name);
    };

    const lastRegion = await mongoose.models['Region'].find({ country: this.country }).sort({ idNumber: -1 }).limit(1).exec();
    this.idNumber = lastRegion.length ? lastRegion[0].idNumber + 1 : 10;
    next();
  } catch (error) {
    next(error);
  }
});

regionSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const update = this.getUpdate();
    if (update.name) {
      update.name = await common.capitalLetters(update.name);
    };

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Region', regionSchema);
