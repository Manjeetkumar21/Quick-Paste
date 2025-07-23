const mongoose = require('mongoose');

const pasteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  pasteId: {
    type: String,
    unique: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expireAt: {
    type: Date,
    default: () => new Date(+new Date() + 24 * 60 * 60 * 1000)
  },
});

pasteSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const Paste = mongoose.model('Paste', pasteSchema);

module.exports = Paste;
