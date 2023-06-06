const mongoose = require('mongoose');
const common = require('../services/common');
const { Schema } = mongoose;

const occupationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
});

occupationSchema.index({ name: 1 }, { unique: true });

occupationSchema.pre('save', async function (next) {
  try {
    if (this.name) {
      this.name = await common.capitalLetters(this.name);
    };
    next();
  } catch (error) {
    next(error);
  }
});

occupationSchema.pre('findOneAndUpdate', async function (next) {
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

module.exports = mongoose.model('Occupation', occupationSchema);