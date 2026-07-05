require('dotenv').config()
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const seed = require('./seed')

mongoose.set('strictQuery', false)

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

const start = async () => {
  await mongoose.connect(MONGODB_URI, { family: 4 })
  console.log('connected to MongoDB')

  await seed()

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  })

  console.log(`Server ready at ${url}`)
}

start().catch((error) => {
  console.log('error starting server:', error.message)
  process.exit(1)
})
