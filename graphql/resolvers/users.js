const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { AuthenticationError, UserInputError } = require('apollo-server')

const { validateRegisterInput, validateLoginInput } = require('../../util/validators')
const checkAuth = require('../../util/check-auth');
const { SECRET_KEY } = require('../../config')
const User = require("../../models/User")

function generateToken(user) {
  return jwt.sign({
    id: user.id, email: user.email, username: user.username
  }, SECRET_KEY, { expiresIn: '7d' })
}

module.exports = {
  Query: {
    async getUser(_, args, context) {
      const user = checkAuth(context);
      if (user.id === args.userId) {
        try {
          const user = await User.findById(args.userId);
          if (user) {
            return user;
          } else {
            throw new Error('User not found');
          }
        } catch (err) {
          throw new Error(err);
        }
      } else {
        throw new AuthenticationError('User not found');
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

      const newUser = new User({ username, email, password, createdAt: new Date().toISOString(), type: 'Free' })

      const result = await newUser.save()

      const token = generateToken(result)

      return {
        ...result._doc,
        id: result.id,
        token
      }
    }
  }
}
