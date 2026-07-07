"use client"

import { useState } from "react"
import { generateToken } from "../actions/blogs"

const ApiTokenSection = ({
  initialToken,
  userName,
}: {
  initialToken: string | null
  userName: string
}) => {
  const [token, setToken] = useState(initialToken)

  const handleGenerate = () => {
    const optimisticToken = crypto.randomUUID()
    setToken(optimisticToken)

    void generateToken(Date.now()).then((serverToken) => {
      if (serverToken) {
        setToken(serverToken)
      }
    })
  }

  return (
    <div data-testid="api-token-section" className="mb-8 border rounded p-4">
      <h3 className="text-xl font-semibold mb-2">API Token</h3>
      {token ? (
        <div data-testid="token-display">
          <p className="mb-2">Your API token:</p>
          <code data-testid="api-token" className="bg-gray-100 p-2 rounded block">
            {token}
          </code>
        </div>
      ) : (
        <p data-testid="no-token-message" className="mb-2 text-gray-600">
          No token has been generated yet
        </p>
      )}
      <button
        type="button"
        onClick={handleGenerate}
        data-testid="generate-token-button"
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        generate token
      </button>
      <p className="sr-only">{userName}</p>
    </div>
  )
}

export default ApiTokenSection
