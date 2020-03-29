const {model, Schema} = require('mongoose')

const optionSchema = new Schema({
  date: String,
  time: String,
  ticker: String,
  description: String,
  updated: String,
  sentiment: String,
  aggressor_ind: String,
  option_symbol: String,
  underlying_type: String,
  cost_basis: String,
  put_call: String,
  strike_price: String,
  date_expiration: String,
  option_activity_type: String,
  trade_count: String,
  open_interest: String,
  volume: String,
  bid: String,
  ask: String,
  midpoint: String,
})

module.exports = model('Option', optionSchema)
