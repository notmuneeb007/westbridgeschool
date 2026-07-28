const mongoose = require('mongoose');

const whitelistedIPSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  label: { type: String, default: '' },
  addedBy: { type: String, default: 'auto' },
}, { timestamps: true });

module.exports = mongoose.model('WhitelistedIP', whitelistedIPSchema);
