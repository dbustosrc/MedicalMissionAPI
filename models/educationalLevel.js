const mongoose = require('mongoose');
const common = require('../services/common');
const { Schema } = mongoose;

const educationalLevelSchema = new Schema({
  name: {
    type: String,
    required: true
  },
});

educationalLevelSchema.index({ name: 1 }, { unique: true });

educationalLevelSchema.pre('save', async function (next) {
  try {
    if (this.name) {
      this.name = await common.capitalLetters(this.name);
    }
    next();
  } catch (error) {
    next(error);
  }
});

educationalLevelSchema.pre('findOneAndUpdate', async function (next) {
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

module.exports = mongoose.model('EducationalLevel', educationalLevelSchema);