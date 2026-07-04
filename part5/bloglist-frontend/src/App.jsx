import { useState, useEffect } from 'react'
import {
  Routes,
  Route,
  Link,
  Navigate,
  useMatch,
  useNavigate,
} from 'react-router-dom'
import {
  Container,
  AppBar,
  Toolbar,
  Button,
} from '@mui/material'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const navButtonStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const navigate = useNavigate()

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find((b) => b.id === match.params.id)
    : null

  useEffect(() => {
    blogService.getAll().then((initialBlogs) => {
      setBlogs(initialBlogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch {
      setNotification({ text: 'wrong credentials', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    navigate('/')
  }

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        setBlogs(blogs.concat({
          ...returnedBlog,
          user: { username: user.username, name: user.name, id: user.id },
        }))
        setNotification({
          text: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
          type: 'success',
        })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
  }

  const likeBlog = (id) => {
    const blog = blogs.find((b) => b.id === id)
    const userId = blog.user.id || blog.user

    const changedBlog = {
      user: userId,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    }

    blogService.update(id, changedBlog).then((returnedBlog) => {
      setBlogs(blogs.map((b) => (b.id !== id ? b : returnedBlog)))
    })
  }

  const removeBlog = (id, title, author) => {
    if (window.confirm(`Remove blog ${title} by ${author}?`)) {
      blogService.remove(id).then(() => {
        setBlogs(blogs.filter((b) => b.id !== id))
        navigate('/')
      })
    }
  }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/" sx={navButtonStyle}>
            blogs
          </Button>
          {user && (
            <Button
              color="inherit"
              component={Link}
              to="/blogs/new"
              sx={navButtonStyle}
            >
              create new blog
            </Button>
          )}
          {user ? (
            <Button color="inherit" onClick={handleLogout} sx={navButtonStyle}>
              logout
            </Button>
          ) : (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={navButtonStyle}
            >
              login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Notification notification={notification} />

      <Routes>
        <Route path="/" element={<BlogList blogs={blogs} />} />
        <Route
          path="/login"
          element={
            <LoginForm
              handleLogin={handleLogin}
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
            />
          }
        />
        <Route
          path="/blogs/new"
          element={
            user ? (
              <BlogForm createBlog={addBlog} />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={blog}
              user={user}
              handleLike={likeBlog}
              handleRemove={removeBlog}
            />
          }
        />
      </Routes>
    </Container>
  )
}

export default App
