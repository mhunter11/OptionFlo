const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {AuthenticationError, UserInputError} = require('apollo-server')

const {
  validateRegisterInput,
  validateLoginInput,
} = require('../../util/validators')
const {checkAuth, admin} = require('../../util/check-auth')
const User = require('../../models/User')
const Option = require('../../models/Option')
const stripe = require('stripe')(process.env.STRIPE_SECRET)
const NEW_OPTION = 'NEW_OPTION'

module.exports = {
  Query: {
    async getUser(_, args, context) {
      const user = await checkAuth(context)
      if (user.uid === args.userId) {
        try {
          const firebaseId = args.userId
          const newUser = await User.findOne({firebaseId})
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
        /*for (let index = 0; index < Users.length; index++) {
          const e = Users[index]
          const password = e.password
          const email = e.email
          const username = e.username

          admin
            .auth()
            .generatePasswordResetLink(userEmail, actionCodeSettings)
            .then(link => {
              // Construct password reset email template, embed the link and send
              // using custom SMTP server.
              return sendCustomPasswordResetEmail(email, displayName, link)
            })
            .catch(error => {
              // Some error occurred.
            })

          // admin
          //   .auth()
          //   .createUser({
          //     email: email,
          //     emailVerified: false,
          //     password: password,
          //     displayName: username,
          //   })
          //   .then(function (userRecord) {
          //     // See the UserRecord reference doc for the contents of userRecord.
          //     console.log('Successfully created new user:', userRecord.uid)
          //   })
          //   .catch(function (error) {
          //     console.log('Error creating new user:', error)
          //   })

          // await admin.auth().createUserWithEmailAndPassword(email, password)
          // admin.auth().sendPasswordResetEmail(email)
        }*/
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
    async giveExistingUsersFirebaseId(_, {email, firebaseId}, context) {
      const user = await checkAuth(context)

      if (!user) {
        throw new AuthenticationError('Not authenticated')
      }

      const updateUser = await User.findOne({email})

      if (updateUser.firebaseId) {
        console.log('user already has a Firebase ID', user.firebaseId)
        return updateUser
      }

      if (firebaseId == user.uid) {
        updateUser.firebaseId = firebaseId
        const result = await updateUser.save()
        console.log(result)
        return result
      }
    },
    async register(parent, {registerInput: {uid}}) {
      const user = await admin.auth().getUser(uid)
      if (!user) {
        throw new AuthenticationError('Not authenticated')
      }

      const firebaseId = user.uid
      const username = user.displayName
      const email = user.email

      const userFirebaseId = await User.findOne({firebaseId})
      const userEmail = await User.findOne({email})

      if (userFirebaseId) {
        throw new UserInputError('User already exists', {
          errors: {
            firebaseId: 'This user is taken',
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

      const newUser = new User({
        firebaseId,
        username,
        email,
        createdAt: new Date().toISOString(),
        type: '',
        stripeId: '',
        ccLast4: '',
      })

      const result = await newUser.save()

      return {
        ...result._doc,
        id: result.id,
      }
    },
    async createSubscription(_, {source, ccLast4}, context) {
      const user = await checkAuth(context)
      if (!user) {
        throw new AuthenticationError('Not authenticated')
      }
      const firebaseId = user.uid
      const updateUser = await User.findOne({firebaseId})

      const userEmail = user.email
      const customer = await stripe.customers.create({
        email: userEmail,
        source,
        plan: process.env.PLAN,
      })

      updateUser.stripeId = customer.id
      updateUser.type = 'standard'
      updateUser.ccLast4 = ccLast4
      const result = await updateUser.save()
      return result
    },
    async changeCreditCard(_, {source, ccLast4}, context) {
      const user = await checkAuth(context)
      const firebaseId = user.uid
      const updateUser = await User.findOne({firebaseId})

      if (
        !user ||
        !updateUser ||
        !updateUser.stripeId ||
        updateUser.type === ''
      ) {
        throw new AuthenticationError('Not authenticated')
      }

      await stripe.customers.update(updateUser.stripeId, {source})
      updateUser.ccLast4 = ccLast4
      const result = await updateUser.save()
      return result
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
