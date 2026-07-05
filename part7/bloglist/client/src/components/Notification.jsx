import { useNotificationStore } from '../stores/notificationStore'
import { Alert } from '@mui/material'

const Notification = () => {
  const notification = useNotificationStore((state) => state.notification)

  if (notification === null) {
    return null
  }

  return (
    <Alert
      style={{ marginTop: 10, marginBottom: 10 }}
      severity={notification.type}
    >
      {notification.text}
    </Alert>
  )
}

export default Notification
