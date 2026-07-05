import { ALL_BOOKS } from '../queries'

const addBookToQuery = (cache, bookToAdd, genre) => {
  cache.updateQuery({ query: ALL_BOOKS, variables: { genre } }, (data) => {
    if (!data?.allBooks) {
      return data
    }

    const bookExists = data.allBooks.some((book) => book.id === bookToAdd.id)
    if (bookExists) {
      return data
    }

    if (genre && !bookToAdd.genres.includes(genre)) {
      return data
    }

    return {
      allBooks: data.allBooks.concat(bookToAdd),
    }
  })
}

export const addBookToCache = (cache, bookToAdd) => {
  addBookToQuery(cache, bookToAdd, null)
  bookToAdd.genres.forEach((genre) => {
    addBookToQuery(cache, bookToAdd, genre)
  })
}
