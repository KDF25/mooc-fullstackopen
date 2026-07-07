"use client"

import { useActionState } from "react"
import Link from "next/link"
import { registerUser } from "../actions/users"
import { registerInitialState } from "../actions/users.types"

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUser, registerInitialState)

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            required
            defaultValue={state.values.username}
            className="w-full border rounded px-3 py-2"
          />
          {state.errors.username && (
            <p className="text-red-600 text-sm mt-1" data-testid="username-error">
              {state.errors.username}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="name" className="block mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            required
            defaultValue={state.values.name}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            required
            className="w-full border rounded px-3 py-2"
          />
          {state.errors.password && (
            <p className="text-red-600 text-sm mt-1">{state.errors.password}</p>
          )}
        </div>
        <div>
          <label htmlFor="passwordConfirm" className="block mb-1">
            Confirm Password
          </label>
          <input
            id="passwordConfirm"
            type="password"
            name="passwordConfirm"
            required
            className="w-full border rounded px-3 py-2"
          />
          {state.errors.passwordConfirm && (
            <p
              className="text-red-600 text-sm mt-1"
              data-testid="passwordConfirm-error"
            >
              {state.errors.passwordConfirm}
            </p>
          )}
        </div>
        <button
          type="submit"
          data-testid="register-button"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
      <p className="mt-4">
        Already have an account? <Link href="/login">Login</Link>
      </p>
    </div>
  )
}
