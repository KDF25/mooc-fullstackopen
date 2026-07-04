import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: 'render here notification...',
  reducers: {
    setNotificationMessage(state, action) {
      return action.payload
    },
    removeNotification() {
      return ''
    },
  },
})

const { setNotificationMessage, removeNotification } = notificationSlice.actions

export const clearNotification = () => removeNotification()

export const setNotification = (message, seconds = 5) => (dispatch) => {
  dispatch(setNotificationMessage(message))
  setTimeout(() => {
    dispatch(removeNotification())
  }, seconds * 1000)
}

export default notificationSlice.reducer
