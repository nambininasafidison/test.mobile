"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import * as SecureStore from "expo-secure-store"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  updateProfile: (name: string, email: string) => Promise<boolean>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const mockUsers = [
  {
    id: "1",
    email: "test@example.com",
    name: "John Doe",
    password: "password123",
  },
  {
    id: "2",
    email: "admin@example.com",
    name: "Admin User",
    password: "admin123",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthState()
  }, [])

  const checkAuthState = async () => {
    try {
      const savedUser = await SecureStore.getItemAsync("user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (error) {
      console.error("Error checking auth state:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)
    if (foundUser) {
      const userData = { id: foundUser.id, email: foundUser.email, name: foundUser.name }
      setUser(userData)
      await SecureStore.setItemAsync("user", JSON.stringify(userData))
      return true
    }
    return false
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    const existingUser = mockUsers.find((u) => u.email === email)
    if (existingUser) {
      return false
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      password,
    }
    mockUsers.push(newUser)

    const userData = { id: newUser.id, email: newUser.email, name: newUser.name }
    setUser(userData)
    await SecureStore.setItemAsync("user", JSON.stringify(userData))
    return true
  }

  const logout = async () => {
    setUser(null)
    await SecureStore.deleteItemAsync("user")
  }

  const updateProfile = async (name: string, email: string): Promise<boolean> => {
    if (user) {
      const updatedUser = { ...user, name, email }
      setUser(updatedUser)
      await SecureStore.setItemAsync("user", JSON.stringify(updatedUser))
      return true
    }
    return false
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
