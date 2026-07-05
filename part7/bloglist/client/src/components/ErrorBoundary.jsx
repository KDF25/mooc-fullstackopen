import React from 'react'
import { Alert, Button, Typography } from '@mui/material'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          <Typography variant="h6">Something went wrong.</Typography>
          <Typography sx={{ mt: 1 }}>{this.state.error.message}</Typography>
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            try again
          </Button>
        </Alert>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
