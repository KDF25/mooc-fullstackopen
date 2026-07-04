import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'
import { setNotification } from './notificationReducer'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    vote(state, action) {
      const id = action.payload.id
      return state.map((anecdote) =>
        anecdote.id !== id ? anecdote : action.payload,
      )
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
  },
})

const { vote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => async (dispatch) => {
  const anecdotes = await anecdoteService.getAll()
  dispatch(setAnecdotes(anecdotes))
}

export const addAnecdote = (content) => async (dispatch) => {
  const anecdote = await anecdoteService.createNew(content)
  dispatch(appendAnecdote(anecdote))
  dispatch(setNotification(`a new anecdote '${content}'`, 5))
}

export const voteAnecdote = (id) => async (dispatch) => {
  const anecdote = await anecdoteService.getById(id)
  const updated = { ...anecdote, votes: anecdote.votes + 1 }
  const saved = await anecdoteService.update(id, updated)
  dispatch(vote(saved))
  dispatch(setNotification(`you voted '${anecdote.content}'`, 10))
}

export default anecdoteSlice.reducer
