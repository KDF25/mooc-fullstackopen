const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
})

test('users are returned as json', async () => {
  await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('a valid user can be created', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'secret',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

  const usernames = usersAtEnd.map(u => u.username)
  assert(usernames.includes('testuser'))
})

test('creation fails with proper statuscode and message if username too short', async () => {
  const newUser = {
    username: 'jo',
    name: 'Test User',
    password: 'secret',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert(result.body.error.includes('username'))

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, 0)
})

test('creation fails with proper statuscode and message if password too short', async () => {
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'se',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert(result.body.error.includes('password'))

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, 0)
})

test('creation fails with proper statuscode and message if username already taken', async () => {
  await helper.createUser(helper.rootUser)

  const newUser = {
    username: 'root',
    name: 'Another User',
    password: 'secret',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert(result.body.error.includes('unique'))

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, 1)
})

after(async () => {
  await mongoose.connection.close()
})
