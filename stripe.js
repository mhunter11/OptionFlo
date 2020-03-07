const Stripe = require('stripe')(process.env.STRIPE_SECRET)

module.exports = {
  stripe: new Stripe(process.env.STRIPE_SECRET)
}