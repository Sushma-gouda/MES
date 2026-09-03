import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Dashboard() {
  const [user, setUser] = useState(null)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("access_token")

    // No token → user is not logged in
    if (!token) {
      navigate("/login")
      return
    }

    // Get logged-in user's details
    const getCurrentUser = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/auth/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        // Token is invalid or expired
        if (!response.ok) {
          localStorage.removeItem("access_token")
          navigate("/login")
          return
        }

        // Save user details
        setUser(data)

      } catch (error) {
        console.error("Error fetching user:", error)
        setError("Unable to connect to the server")
      }
    }

    getCurrentUser()
  }, [navigate])

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("access_token")
    navigate("/login")
  }

  // Loading state
  if (!user && !error) {
    return <p>Loading...</p>
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1 className="logo">MES</h1>

        <h2>Dashboard</h2>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {user && (
          <>
            <p>
              <strong>Welcome, {user.name}</strong>
            </p>

            <p>
              Email: {user.email}
            </p>

            <p>
              Email verified:{" "}
              {user.is_verified ? "Yes" : "No"}
            </p>

            <button
              className="login-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}

      </div>
    </div>
  )
}

export default Dashboard