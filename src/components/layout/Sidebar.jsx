import { NavLink } from "react-router-dom"
import "../../styles/app.css"

// ===== ICONS (inline SVG — no dependency) =====
const icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  orders: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  ),
  schedule: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </svg>
  ),
  capacity: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  ),
  staging: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  ),
  bom: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3h6l2 3h10v13H3z" />
      <path d="M9 13h6M9 17h4" />
    </svg>
  ),
  setup: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.07 4.93l-1.41 1.41M5.34 18.66l-1.41 1.41M19.07 19.07l-1.41-1.41M5.34 5.34l-1.41-1.41M22 12h-2M4 12H2M12 22v-2M12 4V2" />
    </svg>
  ),
  execute: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  monitoring: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  quality: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  trace: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  ),
  oee: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <path d="M22 20H2" />
    </svg>
  ),
  handoff: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  inventory: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
    </svg>
  ),
  dispatch: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  chevronLeft: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  chevronRight: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),
  factory: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20V8l6-4v4l6-4v4l6-4v16" />
      <path d="M2 20h20" />
      <rect x="8" y="14" width="3" height="6" /><rect x="13" y="14" width="3" height="6" />
    </svg>
  ),
}

const navGroups = [
  {
    label: "Control Center",
    items: [
      { label: "Dashboard", to: "/dashboard", icon: icons.dashboard },
    ]
  },
  {
    label: "Plan & Release",
    items: [
      { label: "Production Orders", to: "/production-orders", icon: icons.orders },
      { label: "Planning & Scheduling", to: "/planning", icon: icons.schedule },
      { label: "Capacity Planning", to: "/capacity", icon: icons.capacity },
      { label: "Dispatch to MES", to: "/mes-dispatch", icon: icons.execute },
    ]
  },
  {
    label: "Execute",
    items: [
      { label: "Staging & Kitting", to: "/staging", icon: icons.staging },
      { label: "Operations & BOM", to: "/operations", icon: icons.bom },
      { label: "Machine Setup", to: "/machine-setup", icon: icons.setup },
      { label: "Production Execution", to: "/execution", icon: icons.execute },
    ]
  },
  {
    label: "Assure & Track",
    items: [
      { label: "Live Monitoring", to: "/monitoring", icon: icons.monitoring },
      { label: "Quality Management", to: "/quality", icon: icons.quality },
      { label: "Traceability", to: "/traceability", icon: icons.trace },
      { label: "OEE Monitoring", to: "/oee", icon: icons.oee },
      { label: "Operation Hand-off", to: "/handoff", icon: icons.handoff },
    ]
  },
  {
    label: "Close & Dispatch",
    items: [
      { label: "Inventory & Backflush", to: "/inventory", icon: icons.inventory },
      { label: "Closeout & Dispatch", to: "/dispatch", icon: icons.dispatch },
    ]
  },
]

function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${mobileOpen ? "visible" : ""}`}
        onClick={onMobileClose}
      />

      <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            {icons.factory}
          </div>
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">MES</span>
            <span className="sidebar-brand-tagline">Manufacturing Execution</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {navGroups.map((group) => (
            <div key={group.label} className="sidebar-group">
              <div className="sidebar-group-label">{group.label}</div>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `sidebar-item ${isActive ? "active" : ""}`
                  }
                  onClick={onMobileClose}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="sidebar-item-icon">{item.icon}</span>
                  <span className="sidebar-item-label">{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <button
          className="sidebar-collapse-btn"
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? icons.chevronRight : icons.chevronLeft}
        </button>
      </aside>
    </>
  )
}

export default Sidebar
