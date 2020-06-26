const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {AuthenticationError, UserInputError} = require('apollo-server')

const {
  validateRegisterInput,
  validateLoginInput,
} = require('../../util/validators')
const checkAuth = require('../../util/check-auth')
const User = require('../../models/User')
const Option = require('../../models/Option')
const stripe = require('stripe')(process.env.STRIPE_SECRET)
const NEW_OPTION = 'NEW_OPTION'

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.SECRET_KEY,
    {expiresIn: '7d'}
  )
}

module.exports = {
  Query: {
    async getUser(_, args, context) {
      const user = checkAuth(context)
      if (user.id === args.userId) {
        try {
          const newUser = await User.findById(args.userId)
          if (newUser) {
            return newUser
          } else {
            throw new Error('User not found')
          }
        } catch (err) {
          throw new Error(err)
        }
      } else {
        throw new AuthenticationError('Not Allowed')
      }
    },
    async getOptions() {
      try {
        const Options = await Option.find()
        return Options
      } catch (err) {
        throw new Error(err)
      }
    },
    async getAllUsers() {
      try {
        const Users = await User.find()
        return Users
      } catch (err) {
        throw new Error(err)
      }
    },
    async getOptionsByDate(_, {date}, context) {
      try {
        const Options = await Option.find({date: date})
        return Options
      } catch (err) {
        throw new Error(err)
      }
    },
  },
  Mutation: {
    async login(_, {username, password}, {req}) {
      const {errors, valid} = validateLoginInput(username, password) //email
      const user = await User.findOne({username})
      // const email = await User.findOne({ email })

      if (!user) {
        errors.general = 'User not found'
        throw new UserInputError('User not found', {errors})
      }

      // if (!email) {
      //   errors.general = 'Email not found'
      //   throw new UserInputError("Email not found", { errors })
      // }

      const match = await bcrypt.compare(password, user.password)

      if (!match) {
        errors.general = 'Wrong credentials'
        throw new UserInputError('Wrong credentials', {errors})
      }
      const token = generateToken(user)
      // req.session = { token, userId: user.id }
      // console.log(req.session)
      return {
        ...user._doc,
        id: user.id,
        token,
      }
    },
    async register(
      parent,
      {registerInput: {username, email, password, confirmPassword}}
    ) {
      const {valid, errors} = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      )

      if (!valid) {
        throw new UserInputError('Errors', {errors})
      }

      const userUsername = await User.findOne({username})
      const userEmail = await User.findOne({email})

      if (userUsername) {
        throw new UserInputError('User already exists', {
          errors: {
            username: 'This user is taken',
          },
        })
      }

      if (userEmail) {
        throw new UserInputError('Email already exists', {
          errors: {
            email: 'This email is taken',
          },
        })
      }

      password = await bcrypt.hash(password, 12)

      const newUser = new User({
        username,
        email,
        password,
        createdAt: new Date().toISOString(),
        type: '',
        stripeId: '',
      })

      const result = await newUser.save()

      const token = generateToken(result)

      return {
        ...result._doc,
        id: result.id,
        token,
      }
    },
    async createSubscription(_, {source}, context) {
      const user = checkAuth(context)
      if (!user) {
        throw new AuthenticationError('Not authenticated')
      }
      const username = user.username
      const updateUser = await User.findOne({username})

      const userEmail = user.email
      const customer = await stripe.customers.create({
        email: userEmail,
        source,
        plan: process.env.PLAN,
      })

      updateUser.stripeId = customer.id
      updateUser.type = 'standard'
      const result = await updateUser.save()
      return result
    },
    async changeCreditCard(_, {source}, context) {
      const user = checkAuth(context)

      if (!user || !user.stripeId || user.type === 'free') {
        throw new AuthenticationError('Not authenticated')
      }

      await stripe.customers.update(user.stripeId, {source})

      return user
    },
    async updateUserType(_, {username}, context) {
      // const admin = checkAuth(context)
      const updateUser = await User.findOne({username})

      // if (!admin) {
      //   throw new AuthenticationError('Not authenticated')
      // }

      if (!updateUser) {
        errors.general = 'User not found'
        throw new UserInputError('User not found')
      }
      if (updateUser.type === 'standard') {
        updateUser.type = ''
        const result = await updateUser.save()
        return result
      } else {
        updateUser.type = 'standard'
        const result = await updateUser.save()
        return result
      }
    },
    async saveOption(_, {options}, context) {
      let results = []

      console.log('Saving options')

      for (let i = 0; i < options.length; i++) {
        const op = options[i]

        const option_id = op.id
        const optionExist = await Option.findOne({option_id})

        if (optionExist) {
          console.log('Option already exist')
          continue
        }

        const date = op.date.substring(0, 10)
        const time = op.time
        const ticker = op.ticker
        const description = op.description
        const updated = op.updated
        const sentiment = op.sentiment
        const aggressor_ind = op.aggressor_ind
        const option_symbol = op.option_symbol
        const underlying_type = op.underlying_type
        const cost_basis = op.cost_basis
        const put_call = op.put_call
        const price = op.price
        const size = op.size
        const day_volume = op.day_volume
        const strike_price = op.strike_price
        const date_expiration = op.date_expiration
        const option_activity_type = op.option_activity_type
        const trade_count = op.trade_count
        const open_interest = op.open_interest
        const volume = op.volume
        const bid = op.bid
        const ask = op.ask
        const midpoint = op.midpoint

        const newOption = new Option({
          date,
          time,
          ticker,
          description,
          updated,
          sentiment,
          aggressor_ind,
          option_symbol,
          underlying_type,
          cost_basis,
          put_call,
          price,
          size,
          day_volume,
          strike_price,
          date_expiration,
          option_activity_type,
          trade_count,
          open_interest,
          volume,
          bid,
          ask,
          midpoint,
          option_id,
        })

        const result = await newOption.save()
        context.newPubSub.publish(NEW_OPTION, {newOption: result})

        results.push(result)
      }

      results = results.map(function (o) {
        return {
          ...o._doc,
          id: o.id,
        }
      })
      return results
    },
  },
  Subscription: {
    newOption: {
      subscribe: (_, __, {newPubSub}) => newPubSub.asyncIterator([NEW_OPTION]),
    },
  },
}
