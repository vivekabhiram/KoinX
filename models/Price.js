const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  currency: {
    type: String,
    required: true,
    default: 'INR'
  },
  value: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Price', priceSchema);
