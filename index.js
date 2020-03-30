require('dotenv').config()
const {ApolloServer, PubSub} = require('apollo-server')
const mongoose = require('mongoose')

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

const {MONGO} = require('./config')

const newPubSub = new PubSub()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => ({req, newPubSub}),
})

mongoose
  .connect(MONGO, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('MongoDB Connected')
    return server.listen({port: 5000})
  })
  .then(res => {
    console.log(`Server running at ${res.url}`)
  })
