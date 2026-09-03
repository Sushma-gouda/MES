import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "../App.css"

function OTP() {
  const navigate = useNavigate()
  const location = useLocation()

  const email = location.state?.email || ""

  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")
    setSuccess("")

    const trimmedOTP = otp.trim()

    // Check OTP
    if (!trimmedOTP) {
      setError("Please enter the OTP")
      return
    }

    if (!/^\d{6}$/.test(trimmedOTP)) {
      setError("OTP must be 6 digits")
      return
    }

    if (!email) {
      setError("Email information is missing. Please signup again.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            otp: trimmedOTP,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.detail || "OTP verification failed")
        return
      }

      setSuccess("Email verified successfully!")

      // After successful verification, go to login
      setTimeout(() => {
        navigate("/login")
      }, 1000)

    } catch (error) {
      setError("Unable to connect to the server")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1 className="logo">MES</h1>

        <h2>Verify Email</h2>

        <p>
          Enter the 6-digit OTP sent to your email.
        </p>

        {email && (
          <p>
            OTP sent to: <strong>{email}</strong>
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <input
            className="auth-input"
            type="text"
            inputMode="numeric"
            placeholder="Enter OTP"
            value={otp}
            maxLength={6}
            onChange={(e) => setOtp(e.target.value)}
          />

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {success && (
            <p>
              {success}
            </p>
          )}

          <button
            className="login-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

      </div>
    </div>
  )
}

export default OTP