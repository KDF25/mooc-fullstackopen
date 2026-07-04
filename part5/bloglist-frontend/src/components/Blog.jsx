import { Typography, Paper, Button, Box } from '@mui/material'

const Blog = ({ blog, user, handleLike, handleRemove }) => {
  if (!blog) {
    return null
  }

  return (
    <Paper elevation={2} className="blog" sx={{ p: 2, mt: 2 }}>
      <Typography variant="h5" className="blogTitle" component="div">
        {blog.title}
      </Typography>
      <Typography className="blogAuthor" component="div">
        {blog.author}
      </Typography>
      <Typography className="blogUrl" component="div">
        {blog.url}
      </Typography>
      <Typography className="blogLikes" component="div">
        likes {blog.likes}
      </Typography>
      <Typography component="div">{blog.user.name}</Typography>
      <Box sx={{ mt: 1 }}>
        {user && (
          <Button variant="contained" onClick={() => handleLike(blog.id)}>
            like
          </Button>
        )}
        {user && blog.user.username === user.username && (
          <Button
            variant="contained"
            color="error"
            onClick={() => handleRemove(blog.id, blog.title, blog.author)}
            sx={{ ml: 1 }}
          >
            remove
          </Button>
        )}
      </Box>
    </Paper>
  )
}

export default Blog
