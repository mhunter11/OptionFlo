const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
  type: String,
  stripeId: String,
});

module.exports = model('User', userSchema);