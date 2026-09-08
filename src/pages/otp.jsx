import { useState, useRef, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "../styles/auth.css"

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

const MailIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const FactoryIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20V8l6-4v4l6-4v4l6-4v16" /><path d="M2 20h20" />
    <rect x="8" y="14" width="3" height="6" /><rect x="13" y="14" width="3" height="6" />
  </svg>
)

function OTP() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ""

  const [digits, setDigits] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRefs = useRef([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newDigits = [...digits]
    newDigits[index] = value.slice(-1)
    setDigits(newDigits)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (pasted.length === 6) {
      setDigits(pasted.split(""))
      inputRefs.current[5]?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const trimmedOTP = digits.join("")

    if (!trimmedOTP) { setError("Please enter the OTP"); return }
    if (!/^\d{6}$/.test(trimmedOTP)) { setError("OTP must be 6 digits"); return }
    if (!email) { setError("Email information is missing. Please signup again."); return }

    setIsSubmitting(true)

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: trimmedOTP }),
      })

      const data = await response.json()

      if (!response.ok) { setError(data.detail || "OTP verification failed"); return }

      setSuccess("Email verified successfully!")
      setTimeout(() => navigate("/login"), 1200)

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
            One last step<br />before you're in.
          </h1>
          <p className="auth-left-subheadline">
            We sent a verification code to your email. Enter it to activate your NexusMES account.
          </p>
          <ul className="auth-left-features">
            <li className="auth-left-feature"><span className="auth-feature-dot" />Code expires in 10 minutes</li>
            <li className="auth-left-feature"><span className="auth-feature-dot" />Check your spam/junk folder if not received</li>
            <li className="auth-left-feature"><span className="auth-feature-dot" />Each code is single-use only</li>
          </ul>
        </div>
        <div className="auth-left-footer">
          <div className="auth-left-stats">
            <div className="auth-stat"><span className="auth-stat-number">256-bit</span><span className="auth-stat-label">Encryption</span></div>
            <div className="auth-stat"><span className="auth-stat-number">SOC 2</span><span className="auth-stat-label">Compliant</span></div>
            <div className="auth-stat"><span className="auth-stat-number">2FA</span><span className="auth-stat-label">Protected</span></div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-form-header" style={{ textAlign: "center" }}>
            <div style={{
              width: 64, height: 64,
              background: "rgba(30,64,175,0.08)",
              borderRadius: "var(--radius-2xl)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto var(--space-4)",
              color: "var(--color-brand-primary)"
            }}>
              <MailIcon />
            </div>
            <p className="auth-form-eyebrow">Email Verification</p>
            <h2 className="auth-form-title">Enter your OTP</h2>
            <p className="auth-form-subtitle">
              A 6-digit code was sent to{" "}
              {email
                ? <strong style={{ color: "var(--color-text-primary)" }}>{email}</strong>
                : "your email"
              }
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <div className="otp-inputs" onPaste={handlePaste}>
                {digits.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => inputRefs.current[i] = el}
                    id={`otp-digit-${i}`}
                    className="otp-digit"
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleDigitChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    autoComplete="one-time-code"
                  />
                ))}
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

            <button
              className="btn-primary"
              type="submit"
              disabled={isSubmitting || digits.join("").length !== 6}
              id="otp-submit"
            >
              {isSubmitting ? "Verifying…" : "Verify & Activate"}
            </button>
          </form>

          <p className="auth-footer-link">
            Wrong email?{" "}
            <a href="/signup" onClick={e => { e.preventDefault(); navigate("/signup") }}>Go back</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default OTP