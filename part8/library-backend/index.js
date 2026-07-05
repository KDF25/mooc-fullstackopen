require('dotenv').config()
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const seed = require('./seed')
const User = require('./models/user')

mongoose.set('strictQuery', false)

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

const start = async () => {
  await mongoose.connect(MONGODB_URI, { family: 4 })
  console.log('connected to MongoDB')

  if (process.env.NODE_ENV !== 'test') {
    await seed()
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      const auth = req?.headers?.authorization || ''
      if (auth.startsWith('Bearer ')) {
        try {
          const decoded = jwt.verify(
            auth.substring(7),
            process.env.JWT_SECRET,
          )
          const currentUser = await User.findById(decoded.id)
          return { currentUser }
        } catch {
          return {}
        }
      }
      return {}
    },
  })

  console.log(`Server ready at ${url}`)
}

start().catch((error) => {
  console.log('error starting server:', error.message)
  process.exit(1)
})
