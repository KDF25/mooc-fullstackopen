import { Typography, Paper } from '@mui/material'

const NotFound = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h5">Page not found</Typography>
      <Typography sx={{ mt: 1 }}>
        The page you are looking for does not exist.
      </Typography>
    </Paper>
  )
}

export default NotFound
