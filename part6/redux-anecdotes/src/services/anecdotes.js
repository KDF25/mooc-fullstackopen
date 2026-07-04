const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch anecdotes')
  }

  return response.json()
}

const getById = async (id) => {
  const response = await fetch(`${baseUrl}/${id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch anecdote')
  }

  return response.json()
}

const createNew = async (content) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 }),
  })

  if (!response.ok) {
    throw new Error('Failed to create anecdote')
  }

  return response.json()
}

const update = async (id, anecdote) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anecdote),
  })

  if (!response.ok) {
    throw new Error('Failed to update anecdote')
  }

  return response.json()
}

export default { getAll, getById, createNew, update }
