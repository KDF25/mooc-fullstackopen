export type CreateBlogState = {
  error: string
  success?: boolean
  errors?: {
    title?: string
    author?: string
    url?: string
  }
  values?: {
    title: string
    author: string
    url: string
  }
}

const initialValues = { title: "", author: "", url: "" }

export const createBlogInitialState: CreateBlogState = {
  error: "",
  success: false,
  values: initialValues,
}
