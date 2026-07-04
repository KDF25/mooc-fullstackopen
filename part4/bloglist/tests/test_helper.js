const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/kidding_domain/GoToConsideredHarmful.html',
    likes: 5,
  },
]

const rootUser = {
  username: 'root',
  name: 'Superuser',
  password: 'secret',
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const createUser = async (userData) => {
  const passwordHash = await bcrypt.hash(userData.password, 10)
  const user = new User({
    username: userData.username,
    name: userData.name,
    passwordHash,
  })

  return user.save()
}

const loginUser = async (api, username, password) => {
  const response = await api
    .post('/api/login')
    .send({ username, password })

  return response.body.token
}

module.exports = {
  initialBlogs,
  rootUser,
  blogsInDb,
  usersInDb,
  createUser,
  loginUser,
}
