import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "../../styles/app.css"

// Route to breadcrumb labels
const routeLabels = {
  "/dashboard": ["Dashboard"],
  "/production-orders": ["Plan & Release", "Production Orders"],
  "/planning": ["Plan & Release", "Planning & Scheduling"],
  "/capacity": ["Plan & Release", "Capacity Planning"],
  "/staging": ["Execute", "Staging & Kitting"],
  "/operations": ["Execute", "Operations & BOM"],
  "/machine-setup": ["Execute", "Machine Setup"],
  "/execution": ["Execute", "Production Execution"],
  "/monitoring": ["Assure & Track", "Live Monitoring"],
  "/quality": ["Assure & Track", "Quality Management"],
  "/traceability": ["Assure & Track", "Traceability"],
  "/oee": ["Assure & Track", "OEE Monitoring"],
  "/handoff": ["Assure & Track", "Operation Hand-off"],
  "/inventory": ["Close & Dispatch", "Inventory & Backflush"],
  "/dispatch": ["Close & Dispatch", "Closeout & Dispatch"],
}

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
)

const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
)

const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const ChevronSep = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
)

function Topbar({ collapsed, onMenuToggle, user }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const crumbs = routeLabels[location.pathname] || []

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    navigate("/login")
  }

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
    : "U"

  return (
    <header className={`topbar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="topbar-left">
        {/* Mobile menu button */}
        <button
          className="topbar-icon-btn"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
          style={{ display: "none" }}
          id="mobile-menu-btn"
        >
          <MenuIcon />
        </button>

        {/* Breadcrumbs */}
        {crumbs.length > 0 && (
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <span className="breadcrumb-item">NexusMES</span>
            {crumbs.map((crumb, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <ChevronSep />
                <span className={`breadcrumb-item ${i === crumbs.length - 1 ? "current" : ""}`}>
                  {crumb}
                </span>
              </span>
            ))}
          </nav>
        )}
      </div>

      <div className="topbar-right">
        {/* Plant selector */}
        <div className="plant-selector" title="Current plant">
          <span className="plant-selector-dot" />
          <span className="plant-selector-name">Plant A — Pune</span>
        </div>

        {/* Notifications */}
        <button className="topbar-icon-btn" aria-label="Notifications" title="Notifications">
          <BellIcon />
          <span className="topbar-notif-badge" />
        </button>

        {/* User menu */}
        <div className="topbar-user-wrapper" ref={dropdownRef}>
          <button
            className="topbar-user"
            onClick={() => setDropdownOpen(d => !d)}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <span className="user-name">{user?.name || "User"}</span>
              <span className="user-role">{user?.role || "Operator"}</span>
            </div>
            <ChevronDown />
          </button>

          {dropdownOpen && (
            <div className="user-dropdown" role="menu">
              <div className="user-dropdown-header">
                <div className="user-dropdown-name">{user?.name || "User"}</div>
                <div className="user-dropdown-email">{user?.email || ""}</div>
              </div>

              <button className="user-dropdown-item" role="menuitem">
                <UserIcon /> Profile Settings
              </button>

              <div className="user-dropdown-divider" />

              <button
                className="user-dropdown-item danger"
                role="menuitem"
                onClick={handleLogout}
              >
                <LogoutIcon /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Topbar
