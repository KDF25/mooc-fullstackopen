import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Paper, Typography, List, ListItem } from '@mui/material'
import userService from '../services/users'

const User = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)

  useEffect(() => {
    userService.getById(id).then((data) => setUser(data))
  }, [id])

  if (!user) {
    return null
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h5">{user.name}</Typography>
      <Typography sx={{ mb: 2 }}>added blogs</Typography>
      <List>
        {user.blogs.map((blog) => (
          <ListItem key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export default User
