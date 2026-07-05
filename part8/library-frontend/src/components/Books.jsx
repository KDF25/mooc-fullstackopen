import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const Books = ({ show }) => {
  const [genre, setGenre] = useState(null)

  const result = useQuery(ALL_BOOKS, {
    variables: { genre },
    fetchPolicy: 'cache-and-network',
  })

  const allBooksResult = useQuery(ALL_BOOKS, {
    variables: { genre: null },
    fetchPolicy: 'cache-and-network',
  })

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks
  const genres = [
    ...new Set(
      (allBooksResult.data?.allBooks ?? []).flatMap((book) => book.genres),
    ),
  ]

  return (
    <div>
      <h2>books</h2>
      {genre && <div>in genre {genre}</div>}
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button type="button" onClick={() => setGenre(null)}>
          all genres
        </button>
        {genres.map((g) => (
          <button key={g} type="button" onClick={() => setGenre(g)}>
            {g}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Books
