const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { AuthenticationError, UserInputError } = require('apollo-server')

const { validateRegisterInput, validateLoginInput } = require('../../util/validators')
const checkAuth = require('../../util/check-auth');
const { SECRET_KEY } = require('../../config')
const User = require("../../models/User")
const Option = require("../../models/Option")
const stripe = require('stripe')(process.env.STRIPE_SECRET)


function generateToken(user) {
  return jwt.sign({
    id: user.id, email: user.email, username: user.username
  }, SECRET_KEY, { expiresIn: '7d' })
}

module.exports = {
  Query: {
    async getUser(_, args, context) {
      const user = checkAuth(context);
      console.log(user)
      if (user.id === args.userId) {
        try {
          const newUser = await User.findById(args.userId);
          if (newUser) {
            return newUser;
          } else {
            throw new Error('User not found');
          }
        } catch (err) {
          throw new Error(err);
        }
      } else {
        throw new AuthenticationError('Not Allowed');
      }
    }
  },
  Mutation: {
    async login(_, { username, password }, { req }) {
      const { errors, valid } = validateLoginInput(username, password) //email
      const user = await User.findOne({ username })
      // const email = await User.findOne({ email })

      if (!user) {
        errors.general = 'User not found'
        throw new UserInputError("User not found", { errors })
      }

      // if (!email) {
      //   errors.general = 'Email not found'
      //   throw new UserInputError("Email not found", { errors })
      // }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        errors.general = 'Wrong credentials'
        throw new UserInputError("Wrong credentials", { errors })
      }
      const token = generateToken(user)
      // req.session = { token, userId: user.id }
      // console.log(req.session)
      return {
        ...user._doc,
        id: user.id,
        token
      }
    },
    async register(parent, { registerInput: { username, email, password, confirmPassword } }) {
      const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)

      if (!valid) {
        throw new UserInputError('Errors', { errors })
      }

      const userUsername = await User.findOne({ username })
      const userEmail = await User.findOne({ email })

      if (userUsername) {
        throw new UserInputError("User already exists", {
          errors: {
            username: "This user is taken"
          }
        })
      }

      if (userEmail) {
        throw new UserInputError("Email already exists", {
          errors: {
            email: "This email is taken"
          }
        })
      }

      password = await bcrypt.hash(password, 12)

      const newUser = new User({ username, email, password, createdAt: new Date().toISOString(), type: '', stripeId: "" })

      const result = await newUser.save()

      const token = generateToken(result)

      return {
        ...result._doc,
        id: result.id,
        token
      }
    },
    async createSubscription(_, { source }, context) {
      const user = checkAuth(context);
      if (!user) {
        throw new AuthenticationError("Not authenticated")
      }
      const username = user.username
      const updateUser = await User.findOne({ username })

      const userEmail = user.email
      const customer = await stripe.customers.create({
        email: userEmail,
        source,
        plan: process.env.PLAN
      })

      updateUser.stripeId = customer.id;
      updateUser.type = 'standard';
      const result = await updateUser.save()
      return result
    },
    async saveOption(_, { date, time, ticker, description, updated, sentiment, aggressor_ind, option_symbol, underlying_type, cost_basis, put_call, strike_price, date_expiration, option_activity_type, trade_count, open_interest, volume, bid, ask, midpoint }, __) {
      const newOption = new Option({ date, time, ticker, description, updated, sentiment, aggressor_ind, option_symbol, underlying_type, cost_basis, put_call, strike_price, date_expiration, option_activity_type, trade_count, open_interest, volume, bid, ask, midpoint })

      const result = await newOption.save()

      return {
        ...result._doc,
        id: result.id,
      }
    }
  }
}
