import { useState, useEffect } from "react"
import "../../styles/pages.css"
import "../../styles/components.css"

// ===== KPI CARD =====
function KPICard({ label, value, unit = "", delta, trend, color, icon }) {
  return (
    <div className="kpi-card">
      <div className="kpi-card-header">
        <span className="kpi-card-label">{label}</span>
        <div className={`kpi-card-icon kpi-icon-${color}`}>{icon}</div>
      </div>
      <div className="kpi-card-value">
        {value}{unit && <span style={{ fontSize: "0.55em", fontWeight: 500, color: "var(--color-text-secondary)", marginLeft: 2 }}>{unit}</span>}
      </div>
      {delta && delta !== "—" && (
        <span className={`kpi-card-delta kpi-delta-${trend === "up" ? (color === "red" ? "down" : "up") : (color === "red" ? "up" : "down")}`}>
          {trend === "up" ? "▲" : "▼"} {delta}
        </span>
      )}
      {(!delta || delta === "—") && (
        <span className="kpi-card-delta" style={{ color: "var(--color-text-muted)" }}>
          —
        </span>
      )}
    </div>
  )
}

// ===== STATUS BADGE =====
function StatusBadge({ status }) {
  const map = {
    "IN_PROGRESS": "info",
    "COMPLETED": "success",
    "RECEIVED": "neutral",
    "RELEASED": "blue",
    "ON_HOLD": "warning",
    "READY": "blue",
  }
  const displayMap = {
    "IN_PROGRESS": "In Progress",
    "COMPLETED": "Completed",
    "RECEIVED": "Received",
    "RELEASED": "Released",
    "ON_HOLD": "On Hold",
    "READY": "Ready"
  }
  const variant = map[status] || "neutral"
  const label = displayMap[status] || status
  return (
    <span className={`badge badge-${variant}`}>
      <span className="badge-dot" />{label}
    </span>
  )
}

function Dashboard() {
  const [orders, setOrders] = useState([])
  const [eligibleSchedules, setEligibleSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError("")
        const token = localStorage.getItem("access_token")
        if (!token) return

        const headers = { Authorization: `Bearer ${token}` }

        const [ordersRes, schedulesRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/production-orders/", { headers }),
          fetch("http://127.0.0.1:8000/dispatch-mes/eligible", { headers })
        ])

        if (!ordersRes.ok) throw new Error("Failed to fetch production orders")
        
        const ordersData = await ordersRes.json()
        const schedulesData = schedulesRes.ok ? await schedulesRes.json() : []

        setOrders(ordersData)
        setEligibleSchedules(schedulesData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const today = new Date().toISOString().split('T')[0]
  
  // Calculate KPIs
  const ordersDueToday = orders.filter(o => o.due_date && o.due_date.startsWith(today)).length
  const inProgress = orders.filter(o => o.status === "IN_PROGRESS").length
  const completedToday = orders.filter(o => o.status === "COMPLETED" && o.updated_at && o.updated_at.startsWith(today)).length

  // Shift info (mocked date, since there's no shift API)
  const currentDateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  
  // Map eligible schedules to Upcoming Orders
  const upcomingOrders = eligibleSchedules.slice(0, 5)

  if (loading) {
    return <div style={{ padding: "var(--space-8)", color: "var(--color-text-muted)" }}>Loading dashboard...</div>
  }

  return (
    <div>
      {/* Shift Banner */}
      <div className="shift-banner">
        <div className="shift-info">
          <span className="shift-label">Current Shift</span>
          <span className="shift-value">N/A (Module 6)</span>
        </div>
        <div className="shift-info">
          <span className="shift-label">Date</span>
          <span className="shift-value">{currentDateStr}</span>
        </div>
        <div className="shift-info">
          <span className="shift-label">Supervisor</span>
          <span className="shift-value">—</span>
        </div>
        <div className="shift-info">
          <span className="shift-label">Operators On Floor</span>
          <span className="shift-value">—</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="status-dot dot-amber" />
          <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "var(--text-sm)" }}>Partial Live</span>
        </div>
      </div>

      {error && <div style={{ color: "var(--color-status-danger)", marginBottom: "var(--space-4)" }}>Error: {error}</div>}

      {/* KPI Row 1 — Orders */}
      <div className="page-header" style={{ marginBottom: "var(--space-2)" }}>
        <div className="page-header-left">
          <div className="page-header-eyebrow">Control Center</div>
          <h1 className="page-header-title">Production Dashboard</h1>
          <p className="page-header-subtitle">Real-time overview — {currentDateStr}</p>
        </div>
      </div>

      <div className="dashboard-kpi-row">
        <KPICard label="Orders Due Today" value={ordersDueToday} delta="—" color="blue"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /></svg>} />
        <KPICard label="In Progress" value={inProgress} delta="—" color="teal"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>} />
        <KPICard label="Completed Today" value={completedToday} delta="—" color="green"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>} />
        <KPICard label="Quality Issues" value="N/A" delta="—" color="red"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>} />
      </div>

      {/* OEE Row */}
      <div className="dashboard-kpi-row" style={{ marginBottom: "var(--space-5)" }}>
        {[
          { label: "OEE", value: "—", unit: "", color: "#1e40af" },
          { label: "Availability", value: "—", unit: "", color: "#059669" },
          { label: "Performance", value: "—", unit: "", color: "#d97706" },
          { label: "Quality Rate", value: "—", unit: "", color: "#0d9488" },
        ].map(metric => (
          <div key={metric.label} className="card" style={{ padding: "var(--space-5)" }}>
            <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--space-3)" }}>
              {metric.label}
            </div>
            <div style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: metric.value === "—" ? "var(--color-text-muted)" : metric.color, letterSpacing: "-0.04em", lineHeight: 1 }}>
              {metric.value}<span style={{ fontSize: "0.5em", marginLeft: 2 }}>{metric.unit}</span>
            </div>
            <div style={{ marginTop: "var(--space-3)" }}>
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{ width: `0%`, background: metric.color }}
                />
              </div>
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: "var(--space-2)" }}>
              Awaiting Module integration
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="dashboard-grid">
        {/* Production Chart */}
        <div className="card grid-col-8">
          <div className="card-header">
            <div>
              <div className="card-title">Production Target vs Actual</div>
              <div className="card-subtitle">Module 6 integration pending</div>
            </div>
          </div>
          <div className="card-body" style={{ padding: "var(--space-4) var(--space-5)", display: "flex", alignItems: "center", justifyContent: "center", height: 240 }}>
            <div style={{ color: "var(--color-text-muted)" }}>No data available yet</div>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="card grid-col-4">
          <div className="card-header">
            <div>
              <div className="card-title">Active Alerts</div>
              <div className="card-subtitle">Module 7 integration pending</div>
            </div>
            <span className="badge badge-neutral">0 Active</span>
          </div>
          <div className="card-body" style={{ padding: "var(--space-4)" }}>
            <div className="alert-list">
              <div style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)", textAlign: "center", padding: "var(--space-4)" }}>No active alerts</div>
            </div>
          </div>
        </div>

        {/* Machine Status */}
        <div className="card grid-col-8">
          <div className="card-header">
            <div>
              <div className="card-title">Machine Status</div>
              <div className="card-subtitle">Module 6 integration pending</div>
            </div>
            <div style={{ display: "flex", gap: 12, fontSize: "var(--text-xs)" }}>
              {[["dot-green", "Running"], ["dot-amber", "Idle"], ["dot-red", "Down"], ["dot-blue", "Setup"]].map(([cls, label]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--color-text-muted)" }}>
                  <span className={`status-dot ${cls}`} />{label}
                </div>
              ))}
            </div>
          </div>
          <div className="card-body" style={{ padding: "var(--space-4)", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 150 }}>
            <div style={{ color: "var(--color-text-muted)" }}>Machine tracking not yet integrated</div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card grid-col-4">
          <div className="card-header">
            <div className="card-title">Production Activity</div>
          </div>
          <div className="card-body" style={{ padding: "var(--space-4) var(--space-5)", minHeight: 150, display: "flex", alignItems: "center", justifyContent: "center" }}>
             <div style={{ color: "var(--color-text-muted)" }}>No recent activity logged</div>
          </div>
        </div>

        {/* Upcoming Orders */}
        <div className="card grid-col-12">
          <div className="card-header">
            <div>
              <div className="card-title">Active &amp; Eligible Schedules</div>
              <div className="card-subtitle">Orders in progress and queued for this shift</div>
            </div>
          </div>
          <div className="table-wrapper" style={{ borderRadius: 0, border: "none", boxShadow: "none" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Workcenter</th>
                </tr>
              </thead>
              <tbody>
                {upcomingOrders.map(item => {
                  const priorityClass = { CRITICAL: "priority-critical", HIGH: "priority-high", MEDIUM: "priority-medium", LOW: "priority-low" }
                  const matchingOrder = orders.find(o => o.id === item.production_order_id) || { produced_quantity: 0, quantity: item.quantity, status: "UNKNOWN" }
                  
                  const pct = matchingOrder.quantity > 0 ? Math.round((matchingOrder.produced_quantity / matchingOrder.quantity) * 100) : 0
                  
                  return (
                    <tr key={item.production_schedule_id}>
                      <td><span className="order-number">{item.order_number}</span></td>
                      <td className="table-cell-strong">{item.product_name}</td>
                      <td>{matchingOrder.produced_quantity} / {matchingOrder.quantity}</td>
                      <td style={{ minWidth: 120 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div className="progress-bar-track" style={{ flex: 1 }}>
                            <div className="progress-bar-fill progress-blue" style={{ width: `${pct}%` }} />
                          </div>
                          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", minWidth: 30 }}>{pct}%</span>
                        </div>
                      </td>
                      <td><StatusBadge status={matchingOrder.status} /></td>
                      <td><span className={`badge ${priorityClass[item.priority] || "badge-neutral"}`}>{item.priority}</span></td>
                      <td style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>
                        {matchingOrder.due_date ? new Date(matchingOrder.due_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td><span className="chip">{item.work_center_code}</span></td>
                    </tr>
                  )
                })}
                {upcomingOrders.length === 0 && (
                   <tr>
                      <td colSpan="8" style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--color-text-muted)" }}>No eligible schedules found.</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
