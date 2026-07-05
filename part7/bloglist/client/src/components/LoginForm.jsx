import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'
import { useField } from '../hooks'
import { useUserStore } from '../stores/userStore'
import { useNotificationStore } from '../stores/notificationStore'

const LoginForm = () => {
  const username = useField('text')
  const password = useField('password')
  const navigate = useNavigate()
  const login = useUserStore((state) => state.login)
  const setNotification = useNotificationStore((state) => state.setNotification)

  const { reset: _resetUsername, ...usernameInput } = username
  const { reset: _resetPassword, ...passwordInput } = password

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      await login({
        username: username.value,
        password: password.value,
      })
      username.reset()
      password.reset()
      navigate('/')
    } catch {
      setNotification({ text: 'wrong credentials', type: 'error' })
    }
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <TextField label="username" {...usernameInput} />
        </div>
        <div>
          <TextField label="password" {...passwordInput} />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          login
        </Button>
      </form>
    </div>
  )
}

export default LoginForm
