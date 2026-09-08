import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../styles/auth.css"

// Eye icons
const EyeOpen = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const FactoryIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20V8l6-4v4l6-4v4l6-4v16" /><path d="M2 20h20" />
    <rect x="8" y="14" width="3" height="6" /><rect x="13" y="14" width="3" height="6" />
  </svg>
)

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")

    const trimmedEmail = email.trim()

    if (!trimmedEmail && !password) {
      setError("Please enter your email and password")
      return
    }
    if (!trimmedEmail) { setError("Please enter your email"); return }
    if (!password) { setError("Please enter your password"); return }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(trimmedEmail)) { setError("Please enter a valid email address"); return }
    if (trimmedEmail.length > 254) { setError("Email address is too long"); return }
    if (password.length < 8) { setError("Password must be at least 8 characters long"); return }
    if (password.length > 128) { setError("Password is too long"); return }

    setIsSubmitting(true)

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      })

      const data = await response.json()

      if (!response.ok) { setError(data.detail || "Login failed"); return }
      if (!data.access_token) { setError("Login failed: access token was not received"); return }

      localStorage.setItem("access_token", data.access_token)
      setMessage("Login successful!")
      navigate("/dashboard")

    } catch {
      setError("Unable to connect to the server")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-root">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-left-brand">
          <div className="auth-brand-logo">
            <div className="auth-brand-icon"><FactoryIcon /></div>
            <span className="auth-brand-name">Nexus<span>MES</span></span>
          </div>
          <h1 className="auth-left-headline">
            Production intelligence<br />at your fingertips.
          </h1>
          <p className="auth-left-subheadline">
            NexusMES connects your shop floor to your planning team — in real time, every shift, every order.
          </p>
          <ul className="auth-left-features">
            <li className="auth-left-feature"><span className="auth-feature-dot" />Real-time OEE & production monitoring</li>
            <li className="auth-left-feature"><span className="auth-feature-dot" />End-to-end traceability for every component</li>
            <li className="auth-left-feature"><span className="auth-feature-dot" />Integrated quality management & NCR tracking</li>
            <li className="auth-left-feature"><span className="auth-feature-dot" />Paperless shop-floor execution</li>
          </ul>
        </div>
        <div className="auth-left-footer">
          <div className="auth-left-stats">
            <div className="auth-stat"><span className="auth-stat-number">99.2%</span><span className="auth-stat-label">Uptime SLA</span></div>
            <div className="auth-stat"><span className="auth-stat-number">18+</span><span className="auth-stat-label">MES Modules</span></div>
            <div className="auth-stat"><span className="auth-stat-number">ISO 9001</span><span className="auth-stat-label">Certified</span></div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <p className="auth-form-eyebrow">Secure Sign In</p>
            <h2 className="auth-form-title">Welcome back</h2>
            <p className="auth-form-subtitle">Sign in to your NexusMES workspace</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label className="auth-label" htmlFor="login-email">Work Email</label>
              <input
                id="login-email"
                className="auth-input"
                type="email"
                placeholder="you@company.com"
                value={email}
                maxLength={254}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="login-password">Password</label>
              <div className="auth-input-wrapper">
                <input
                  id="login-password"
                  className="auth-input has-icon-right"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={password}
                  maxLength={128}
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="auth-input-icon-right"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-error" role="alert">
                <span className="auth-icon"><AlertIcon /></span>
                {error}
              </div>
            )}
            {message && (
              <div className="auth-success" role="status">
                <span className="auth-icon"><CheckIcon /></span>
                {message}
              </div>
            )}

            <button
              className="btn-primary"
              type="submit"
              disabled={isSubmitting}
              id="login-submit"
            >
              {isSubmitting ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="auth-footer-link">
            Don't have an account?{" "}
            <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login