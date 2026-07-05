import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { LOGIN } from '../queries'

const Login = ({ setToken, setError, showForm, setShowForm }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login] = useMutation(LOGIN, {
    onError: () => {
      setError('login failed')
    },
    onCompleted: ({ login }) => {
      localStorage.setItem('library-token', login.value)
      setToken(login.value)
      setShowForm(false)
      setUsername('')
      setPassword('')
    },
  })

  const submit = async (event) => {
    event.preventDefault()

    try {
      await login({ variables: { username, password } })
    } catch {
      // error handled in onError
    }
  }

  return (
    <div>
      <button type="button" onClick={() => setShowForm(true)}>
        login
      </button>
      {showForm && (
        <form onSubmit={submit}>
          <div>
            <input
              aria-label="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <input
              aria-label="password"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      )}
    </div>
  )
}

export default Login
