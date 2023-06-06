const mongoose = require('mongoose');
const common = require('../services/common');
const { Schema } = mongoose;

const ethnicGroupSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
});

ethnicGroupSchema.index({ name: 1 }, { unique: true });

ethnicGroupSchema.pre('save', async function (next) {
  try {
    if (this.name) {
      this.name = await common.capitalLetters(this.name);
    };
    next();
  } catch (error) {
    next(error);
  }
});

ethnicGroupSchema.pre('findOneAndUpdate', async function (next) {
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

module.exports = mongoose.model('EthnicGroup', ethnicGroupSchema);