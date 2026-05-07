import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { loginUser, registerUser } from "../api"
import toast from "react-hot-toast"

const Auth = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true)
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const { login } = useAuth()

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = isLogin
        ? await loginUser(email, password)
        : await registerUser(name, email, password)

      if (response.success && response.data) {
        login(response.data)
        toast.success(isLogin ? "Welcome back!" : "Account created!")
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error("Something went wrong")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">⚡</div>
          <div className="auth-logo-text">DevTools AI</div>
          <div className="auth-logo-sub">Code Intelligence Platform</div>
        </div>

        <h2 className="auth-title">
          {isLogin ? "Welcome back" : "Create account"}
        </h2>
        <p className="auth-subtitle">
          {isLogin
            ? "Login to access your tools and history"
            : "Start analyzing code with AI"}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="auth-field">
              <label>Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="auth-switch-btn"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Auth