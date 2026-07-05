import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'
import { useField } from '../hooks'
import { useBlogStore } from '../stores/blogStore'

const BlogForm = ({ createBlog }) => {
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')
  const navigate = useNavigate()
  const storeCreateBlog = useBlogStore((state) => state.createBlog)
  const addBlogHandler = createBlog || storeCreateBlog

  const { reset: _resetTitle, ...titleInput } = title
  const { reset: _resetAuthor, ...authorInput } = author
  const { reset: _resetUrl, ...urlInput } = url

  const addBlog = async (event) => {
    event.preventDefault()
    await addBlogHandler({
      title: title.value,
      author: author.value,
      url: url.value,
    })
    title.reset()
    author.reset()
    url.reset()
    navigate('/')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <TextField label="title" {...titleInput} />
        </div>
        <div>
          <TextField label="author" {...authorInput} />
        </div>
        <div>
          <TextField label="url" {...urlInput} />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          create
        </Button>
      </form>
    </div>
  )
}

export default BlogForm
