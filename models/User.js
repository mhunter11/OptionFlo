const {model, Schema} = require('mongoose')

const userSchema = new Schema({
  username: String,
  email: String,
  createdAt: String,
  type: String,
  stripeId: String,
  admin: Boolean,
  ccLast4: {type: String, default: ''},
})

module.exports = model('User', userSchema)
