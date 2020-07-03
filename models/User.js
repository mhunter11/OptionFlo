const {model, Schema} = require('mongoose')

const userSchema = new Schema({
  firebaseId: String,
  username: String,
  email: String,
  createdAt: String,
  type: String,
  stripeId: String,
})

module.exports = model('User', userSchema)
