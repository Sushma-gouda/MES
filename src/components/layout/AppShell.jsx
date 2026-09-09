import { useState, useEffect } from "react"
import { useNavigate, Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import "../../styles/app.css"

function AppShell() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // Fetch current user (same pattern as existing dashboard)
  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      navigate("/login")
      return
    }

    const fetchUser = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/auth/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) {
          localStorage.removeItem("access_token")
          navigate("/login")
          return
        }
        const data = await response.json()
        setUser({
          ...data,
          role: "Production Supervisor", // role not in current backend schema, default here
        })
      } catch {
        // Backend unreachable — use stub so app still works in dev
        setUser({ name: "Demo User", email: "demo@MES.io", role: "Supervisor", is_verified: true })
      }
    }

    fetchUser()
  }, [navigate])

  // Apply mobile menu button visibility via CSS class on topbar
  useEffect(() => {
    const btn = document.getElementById("mobile-menu-btn")
    if (btn) {
      btn.style.display = "flex"
    }
  }, [])

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setMobileOpen(false)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="app-shell">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className={`app-main ${collapsed ? "sidebar-collapsed" : ""}`}>
        <Topbar
          collapsed={collapsed}
          onMenuToggle={() => setMobileOpen(m => !m)}
          user={user}
        />

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppShell
