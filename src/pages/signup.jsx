import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../styles/auth.css"

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

function getStrength(password) {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~;'+=]/.test(password)) score++
  return score
}

const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"]
const strengthClasses = ["", "active-weak", "active-fair", "active-good", "active-strong"]

function Signup() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()
  const strength = getStrength(password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()

    if (!trimmedName && !trimmedEmail && !password && !confirmPassword) {
      setError("Please fill in all fields"); return
    }
    if (!trimmedName) { setError("Please enter your name"); return }
    if (trimmedName.length < 2) { setError("Name must be at least 2 characters long"); return }
    if (trimmedName.length > 100) { setError("Name is too long"); return }
    if (!/^[A-Za-z\s]+$/.test(trimmedName)) { setError("Name can contain only letters and spaces"); return }
    if (!trimmedEmail) { setError("Please enter your email"); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) { setError("Please enter a valid email address"); return }
    if (trimmedEmail.length > 254) { setError("Email address is too long"); return }
    if (!password) { setError("Please enter a password"); return }
    if (password.length < 8) { setError("Password must be at least 8 characters long"); return }
    if (password.length > 128) { setError("Password is too long"); return }
    if (!/[A-Z]/.test(password)) { setError("Password must contain at least one uppercase letter"); return }
    if (!/[a-z]/.test(password)) { setError("Password must contain at least one lowercase letter"); return }
    if (!/[0-9]/.test(password)) { setError("Password must contain at least one number"); return }
    if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~;'+=]/.test(password)) { setError("Password must contain at least one special character"); return }
    if (!confirmPassword) { setError("Please confirm your password"); return }
    if (password !== confirmPassword) { setError("Passwords do not match"); return }

    setIsSubmitting(true)

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail, password }),
      })

      const data = await response.json()

      if (!response.ok) { setError(data.detail || "Signup failed"); return }

      setSuccess(data.message || "Account created successfully. OTP sent to your email.")
      navigate("/otp", { state: { email: trimmedEmail } })

    } catch {
      setError("Unable to connect to the server. Please try again.")
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
            Join the future of<br />smart manufacturing.
          </h1>
          <p className="auth-left-subheadline">
            Set up your MES account and bring full visibility to your production floor in minutes.
          </p>
          <ul className="auth-left-features">
            <li className="auth-left-feature"><span className="auth-feature-dot" />Complete production order lifecycle</li>
            <li className="auth-left-feature"><span className="auth-feature-dot" />Automated OEE & downtime tracking</li>
            <li className="auth-left-feature"><span className="auth-feature-dot" />Built-in quality & NCR management</li>
            <li className="auth-left-feature"><span className="auth-feature-dot" />Inventory backflush & dispatch</li>
          </ul>
        </div>
        <div className="auth-left-footer">
          <div className="auth-left-stats">
            <div className="auth-stat"><span className="auth-stat-number">5 min</span><span className="auth-stat-label">Setup time</span></div>
            <div className="auth-stat"><span className="auth-stat-number">Free</span><span className="auth-stat-label">Trial available</span></div>
            <div className="auth-stat"><span className="auth-stat-number">24/7</span><span className="auth-stat-label">Support</span></div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <p className="auth-form-eyebrow">New Account</p>
            <h2 className="auth-form-title">Create your account</h2>
            <p className="auth-form-subtitle">Enter your details to get started</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label className="auth-label" htmlFor="signup-name">Full Name</label>
              <input
                id="signup-name"
                className="auth-input"
                type="text"
                placeholder="e.g. Priya Sharma"
                value={name}
                maxLength={100}
                autoComplete="name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="signup-email">Work Email</label>
              <input
                id="signup-email"
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
              <label className="auth-label" htmlFor="signup-password">Password</label>
              <div className="auth-input-wrapper">
                <input
                  id="signup-password"
                  className="auth-input has-icon-right"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 chars with upper, number, symbol"
                  value={password}
                  maxLength={128}
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" className="auth-input-icon-right" onClick={() => setShowPassword(v => !v)}>
                  {showPassword ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>
              {password && (
                <div className="password-strength">
                  <div className="password-strength-bars">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className={`password-strength-bar ${strength >= i ? strengthClasses[strength] : ""}`}
                      />
                    ))}
                  </div>
                  <span className="password-strength-label">
                    {strength > 0 ? `Password strength: ${strengthLabels[strength]}` : ""}
                  </span>
                </div>
              )}
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="signup-confirm">Confirm Password</label>
              <div className="auth-input-wrapper">
                <input
                  id="signup-confirm"
                  className="auth-input has-icon-right"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  maxLength={128}
                  autoComplete="new-password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="button" className="auth-input-icon-right" onClick={() => setShowConfirm(v => !v)}>
                  {showConfirm ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-error" role="alert">
                <span><AlertIcon /></span>
                {error}
              </div>
            )}
            {success && (
              <div className="auth-success" role="status">
                <span><CheckIcon /></span>
                {success}
              </div>
            )}

            <button className="btn-primary" type="submit" disabled={isSubmitting} id="signup-submit">
              {isSubmitting ? "Creating Account…" : "Create Account"}
            </button>
          </form>

          <p className="auth-footer-link">
            Already have an account?{" "}
            <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
