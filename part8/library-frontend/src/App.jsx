import { useState } from 'react'
import { useApolloClient } from '@apollo/client/react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommendations from './components/Recommendations'
import SetBirthYear from './components/SetBirthYear'
import Notify from './components/Notify'

const App = () => {
  const client = useApolloClient()
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('library-token'))
  const [showLogin, setShowLogin] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    localStorage.removeItem('library-token')
    setToken(null)
    setPage('authors')
    client.clearStore()
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button type="button" onClick={() => setPage('authors')}>
          authors
        </button>
        <button type="button" onClick={() => setPage('books')}>
          books
        </button>
        {token ? (
          <>
            <button type="button" onClick={() => setPage('add')}>
              add book
            </button>
            <button type="button" onClick={() => setPage('recommend')}>
              recommend
            </button>
            <button type="button" onClick={logout}>
              logout
            </button>
          </>
        ) : (
          <Login
            setToken={setToken}
            setError={notify}
            showForm={showLogin}
            setShowForm={setShowLogin}
          />
        )}
      </div>
      <Authors show={page === 'authors'} />
      {token && page === 'authors' && (
        <SetBirthYear setError={notify} />
      )}
      <Books show={page === 'books'} />
      <NewBook show={page === 'add' && !!token} setError={notify} />
      <Recommendations show={page === 'recommend' && !!token} />
    </div>
  )
}

export default App
