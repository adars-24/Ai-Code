import { createContext, useContext, useState,type ReactNode } from "react"

interface AuthUser {
  token: string
  name: string
  email: string
}

interface AuthContextType {
  user: AuthUser | null
  login: (user: AuthUser) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = localStorage.getItem("token")
    const name = localStorage.getItem("name")
    const email = localStorage.getItem("email")
    return token && name && email ? { token, name, email } : null
  })

  const login = (userData: AuthUser): void => {
    localStorage.setItem("token", userData.token)
    localStorage.setItem("name", userData.name)
    localStorage.setItem("email", userData.email)
    setUser(userData)
  }

  const logout = (): void => {
    localStorage.removeItem("token")
    localStorage.removeItem("name")
    localStorage.removeItem("email")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}