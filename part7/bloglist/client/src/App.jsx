import { useEffect } from 'react'
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
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './components/NotFound'
import Users from './components/Users'
import User from './components/User'
import { useBlogStore } from './stores/blogStore'
import { useUserStore } from './stores/userStore'

const navButtonStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

const App = () => {
  const navigate = useNavigate()
  const user = useUserStore((state) => state.user)
  const initializeBlogs = useBlogStore((state) => state.initialize)
  const initializeUser = useUserStore((state) => state.initialize)
  const logout = useUserStore((state) => state.logout)
  const blogs = useBlogStore((state) => state.blogs)
  const likeBlog = useBlogStore((state) => state.likeBlog)
  const removeBlog = useBlogStore((state) => state.removeBlog)

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((b) => b.id === match.params.id) : null

  useEffect(() => {
    initializeBlogs()
    initializeUser()
  }, [initializeBlogs, initializeUser])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleRemove = (id) => {
    removeBlog(id, navigate)
  }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/" sx={navButtonStyle}>
            blogs
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/users"
            sx={navButtonStyle}
          >
            users
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

      <Notification />

      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/blogs/new"
            element={user ? <BlogForm /> : <Navigate replace to="/login" />}
          />
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blog={blog}
                user={user}
                handleLike={likeBlog}
                handleRemove={handleRemove}
              />
            }
          />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
