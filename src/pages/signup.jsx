import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../App.css"

function Signup() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")
    setSuccess("")

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()

    // 1. Check if all fields are empty
    if (!trimmedName && !trimmedEmail && !password && !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    // 2. Check name
    if (!trimmedName) {
      setError("Please enter your name")
      return
    }

    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters long")
      return
    }

    if (trimmedName.length > 100) {
      setError("Name is too long")
      return
    }

    const namePattern = /^[A-Za-z\s]+$/

    if (!namePattern.test(trimmedName)) {
      setError("Name can contain only letters and spaces")
      return
    }

    // 3. Check email
    if (!trimmedEmail) {
      setError("Please enter your email")
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(trimmedEmail)) {
      setError("Please enter a valid email address")
      return
    }

    if (trimmedEmail.length > 254) {
      setError("Email address is too long")
      return
    }

    // 4. Check password
    if (!password) {
      setError("Please enter a password")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (password.length > 128) {
      setError("Password is too long")
      return
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter")
      return
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter")
      return
    }

    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number")
      return
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~;'+=]/.test(password)) {
      setError("Password must contain at least one special character")
      return
    }

    // 5. Check confirm password
    if (!confirmPassword) {
      setError("Please confirm your password")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Prevent multiple submissions
    setIsSubmitting(true)

    try {
      // Send signup request to FastAPI
      const response = await fetch(
        "http://127.0.0.1:8000/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: trimmedName,
            email: trimmedEmail,
            password: password,
          }),
        }
      )

      const data = await response.json()

      // Handle backend errors
      if (!response.ok) {
        setError(data.detail || "Signup failed")
        return
      }

      // Signup successful and OTP has been sent
      setSuccess(
        data.message || "Account created successfully. OTP sent to your email."
      )

      // Move to OTP verification page
      navigate("/otp", {
        state: {
          email: trimmedEmail,
        },
      })

    } catch (error) {
      setError(
        "Unable to connect to the server. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1 className="logo">MES</h1>

        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>

          <input
            className="auth-input"
            type="text"
            placeholder="Name"
            value={name}
            maxLength={100}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={email}
            maxLength={254}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            maxLength={128}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            maxLength={128}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {success && (
            <p className="success-message">
              {success}
            </p>
          )}

          <button
            className="login-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>

        </form>

        <p className="signup-text">
          Already have an account?{" "}
          <Link to="/login">Sign In</Link>
        </p>

      </div>
    </div>
  )
}

export default Signup