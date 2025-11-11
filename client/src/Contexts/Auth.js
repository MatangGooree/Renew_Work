import React, { useEffect, createContext, useState, useContext } from 'react'

const AuthContext = React.createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('/api/AuthCheck', { credentials: 'include' })
      const data = await response.json()
      // console.dir(data)
      if (data.success && data.user) {
        setUser(data.user)
      }
    }
    fetchUser()
  }, [])

  const login = async (id, password) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, password }),
      credentials: 'include',
    })

    const data = await response.json()
    if (!data.success) {
      alert(data.message)
      return
    }
    setUser(data.user)
  }

  const logout = async () => {
    const response = await fetch('/api/logout', { credentials: 'include' })
    const data = await response.json()
    if (!data.success) {
      alert(data.message)
    }
    setUser(null)
  }
  const value = { user, login, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
