import { Typography, Paper, Button, Box, TextField } from '@mui/material'
import { useField } from '../hooks'
import { useBlogStore } from '../stores/blogStore'

const Blog = ({ blog, user, handleLike, handleRemove }) => {
  const storeAddComment = useBlogStore((state) => state.addComment)
  const comment = useField('text')
  const { reset: _resetComment, ...commentInput } = comment

  if (!blog) {
    return null
  }

  const submitComment = async (event) => {
    event.preventDefault()
    await storeAddComment(blog.id, comment.value)
    comment.reset()
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
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">comments</Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          {(blog.comments || []).map((c, index) => (
            <Typography component="li" key={index}>
              {c.content}
            </Typography>
          ))}
        </Box>
        <Box component="form" onSubmit={submitComment} sx={{ mt: 2 }}>
          <TextField label="comment" {...commentInput} />
          <Button type="submit" variant="contained" sx={{ ml: 1 }}>
            add comment
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default Blog
