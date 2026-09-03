import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../App.css"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Clear previous messages
    setError("")
    setMessage("")

    // Remove unnecessary spaces from the email
    const trimmedEmail = email.trim()

    // 1. Check if both fields are empty
    if (!trimmedEmail && !password) {
      setError("Please enter your email and password")
      return
    }

    // 2. Check if email is empty
    if (!trimmedEmail) {
      setError("Please enter your email")
      return
    }

    // 3. Check if password is empty
    if (!password) {
      setError("Please enter your password")
      return
    }

    // 4. Check email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(trimmedEmail)) {
      setError("Please enter a valid email address")
      return
    }

    // 5. Check email length
    if (trimmedEmail.length > 254) {
      setError("Email address is too long")
      return
    }

    // 6. Check password length
    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (password.length > 128) {
      setError("Password is too long")
      return
    }

    // Prevent multiple submissions
    setIsSubmitting(true)

    try {
      // Send login details to FastAPI
      const response = await fetch(
        "http://127.0.0.1:8000/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: trimmedEmail,
            password: password,
          }),
        }
      )

      const data = await response.json()

      // Handle FastAPI errors
      if (!response.ok) {
        setError(data.detail || "Login failed")
        return
      }

      // Make sure the backend returned an access token
      if (!data.access_token) {
        setError("Login failed: access token was not received")
        return
      }

      // Store JWT access token in browser
      localStorage.setItem("access_token", data.access_token)

      // Login successful
      setMessage("Login successful!")

      console.log("Login response:", data)

      // Navigate to dashboard
      navigate("/dashboard")

    } catch (error) {
      // Backend/server is not reachable
      setError("Unable to connect to the server")
      console.error("Login error:", error)

    } finally {
      // Allow the button to be clicked again
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1 className="logo">MES</h1>

        <h2>Login</h2>

        <form onSubmit={handleSubmit}>

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

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {message && (
            <p className="success-message">
              {message}
            </p>
          )}

          <button
            className="login-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="signup-text">
          Don't have an account?{" "}
          <Link to="/signup">Signup</Link>
        </p>

      </div>
    </div>
  )
}

export default Login