const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  account: {
    type: Object
  }
})
const User = mongoose.model('User', UserSchema, 'users')
module.exports = User
