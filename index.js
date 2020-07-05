require('dotenv').config()
const {ApolloServer, PubSub} = require('apollo-server')
const mongoose = require('mongoose')

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

const newPubSub = new PubSub()

const PORT = process.env.PORT || 5000

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => ({req, newPubSub}),
  cors: true,
  corsMiddleware: {
    credentials: true,
    origin: (origin, callback) => {
      const whitelist = ['https://optionflo.com']

      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
  },
})

mongoose
  .connect(process.env.MONGO_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB Connected')
    return server.listen({port: PORT})
  })
  .then(res => {
    console.log(`Server running at ${res.url}`)
  })
