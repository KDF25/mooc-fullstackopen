import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'

const SetBirthYear = ({ setError }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const authorsResult = useQuery(ALL_AUTHORS)

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      setError(error.message)
    },
    onCompleted: (data) => {
      if (!data.editAuthor) {
        setError('author not found')
      }
    },
  })

  const submit = (event) => {
    event.preventDefault()

    editAuthor({
      variables: {
        name,
        setBornTo: Number(born),
      },
    })

    setName('')
    setBorn('')
  }

  if (authorsResult.loading) {
    return null
  }

  const authors = authorsResult.data.allAuthors

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <select
            name="name"
            value={name}
            onChange={({ target }) => setName(target.value)}
          >
            <option value="">select author</option>
            {authors.map((author) => (
              <option key={author.name} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            aria-label="born"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default SetBirthYear
