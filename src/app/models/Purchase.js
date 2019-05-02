const mongoose = require('mongoose')

const PurchaseSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ad',
    required: true
  }
})

module.exports = mongoose.model('Purchase', PurchaseSchema)
