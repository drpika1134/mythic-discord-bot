const mongoose = require('mongoose')

const LogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  resources: {
    type: Object,
    required: true
  },
  createdAt: {
    type: Date,
    // expires: 86400,/
    default: Date.now
  }
})
const Log = mongoose.model('Log', LogSchema, 'logs')
module.exports = Log
