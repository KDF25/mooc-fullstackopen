export type RegisterState = {
  errors: {
    username?: string
    name?: string
    password?: string
    passwordConfirm?: string
  }
  values: {
    username: string
    name: string
    password: string
    passwordConfirm: string
  }
}

export const registerInitialState: RegisterState = {
  errors: {},
  values: {
    username: "",
    name: "",
    password: "",
    passwordConfirm: "",
  },
}
