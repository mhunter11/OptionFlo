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
  size: String,
  day_volume: String,
  strike_price: String,
  date_expiration: String,
  option_activity_type: String,
  trade_count: String,
  open_interest: String,
  volume: String,
  midpoint: String,
  option_id: {
    type: String,
    index: true,
    unique: true,
    required: true,
    dropDups: true,
  },
})

module.exports = model('Option', optionSchema)
