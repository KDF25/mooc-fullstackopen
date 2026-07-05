require('dotenv').config()
const { ApolloServer } = require('@apollo/server')
const {
  ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer')
const { expressMiddleware } = require('@as-integrations/express5')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const cors = require('cors')
const express = require('express')
const http = require('http')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const seed = require('./seed')
const User = require('./models/user')
const { createBookCountLoader } = require('./dataloaders')

mongoose.set('strictQuery', false)

const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT || 4000

console.log('connecting to', MONGODB_URI)

const getContext = async (authHeader) => {
  const auth = authHeader || ''
  if (auth.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decoded.id)
      return {
        currentUser,
        bookCountLoader: createBookCountLoader(),
      }
    } catch {
      return { bookCountLoader: createBookCountLoader() }
    }
  }
  return { bookCountLoader: createBookCountLoader() }
}

const start = async () => {
  await mongoose.connect(MONGODB_URI, { family: 4 })
  console.log('connected to MongoDB')

  if (process.env.NODE_ENV !== 'test') {
    await seed()
  }

  const app = express()
  const httpServer = http.createServer(app)

  const schema = makeExecutableSchema({ typeDefs, resolvers })

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })

  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => getContext(req?.headers?.authorization),
    }),
  )

  httpServer.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}/`)
  })
}

start().catch((error) => {
  console.log('error starting server:', error.message)
  process.exit(1)
})
