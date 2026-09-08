import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from "recharts"
import {
  mockDashboardKPIs,
  mockProductionTrend,
  mockMachines,
  mockAlerts,
  mockActivityFeed,
  mockCurrentShift,
  mockProductionOrders,
} from "../../data/mockData"
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
      {delta && (
        <span className={`kpi-card-delta kpi-delta-${trend === "up" ? (color === "red" ? "down" : "up") : (color === "red" ? "up" : "down")}`}>
          {trend === "up" ? "▲" : "▼"} {delta} vs prev. shift
        </span>
      )}
    </div>
  )
}

// ===== STATUS BADGE =====
function StatusBadge({ status }) {
  const map = {
    "In Progress": "info",
    "Completed": "success",
    "Queued": "neutral",
    "Released": "blue",
    "On Hold": "warning",
    "running": "success",
    "idle": "warning",
    "down": "danger",
    "setup": "info",
  }
  const variant = map[status] || "neutral"
  return (
    <span className={`badge badge-${variant}`}>
      <span className="badge-dot" />{status}
    </span>
  )
}

// ===== MACHINE STATUS CARD =====
function MachineCard({ machine }) {
  const statusColor = { running: "green", idle: "amber", down: "red", setup: "blue" }
  const color = statusColor[machine.status] || "gray"
  return (
    <div className={`machine-card status-${machine.status}`}>
      <div className="machine-id">{machine.id}</div>
      <div className="machine-name" title={machine.name}>{machine.name}</div>
      <div className="machine-status-row">
        <span className={`status-dot dot-${color}`} />
        <span className="machine-status-label" style={{ textTransform: "capitalize" }}>{machine.status}</span>
      </div>
      {machine.job && <div className="machine-uptime" style={{ fontFamily: "JetBrains Mono, monospace" }}>{machine.job}</div>}
      {machine.uptime !== "—" && <div className="machine-uptime">Uptime: {machine.uptime}</div>}
    </div>
  )
}

// ===== CUSTOM TOOLTIP =====
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#fff"
    }}>
      <div style={{ marginBottom: 6, fontWeight: 600, color: "#94a3b8" }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />
          <span style={{ color: "#cbd5e1" }}>{p.name}:</span>
          <span style={{ fontWeight: 600 }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

function Dashboard() {
  const kpis = mockDashboardKPIs
  const upcomingOrders = mockProductionOrders.filter(o => o.status === "In Progress" || o.status === "Queued").slice(0, 5)

  return (
    <div>
      {/* Shift Banner */}
      <div className="shift-banner">
        <div className="shift-info">
          <span className="shift-label">Current Shift</span>
          <span className="shift-value">{mockCurrentShift.name} ({mockCurrentShift.code}) · {mockCurrentShift.start}–{mockCurrentShift.end}</span>
        </div>
        <div className="shift-info">
          <span className="shift-label">Date</span>
          <span className="shift-value">{mockCurrentShift.date}</span>
        </div>
        <div className="shift-info">
          <span className="shift-label">Supervisor</span>
          <span className="shift-value">{mockCurrentShift.supervisor}</span>
        </div>
        <div className="shift-info">
          <span className="shift-label">Operators On Floor</span>
          <span className="shift-value">{mockCurrentShift.operators}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="status-dot dot-green dot-live" />
          <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "var(--text-sm)" }}>Live</span>
        </div>
      </div>

      {/* KPI Row 1 — Orders */}
      <div className="page-header" style={{ marginBottom: "var(--space-2)" }}>
        <div className="page-header-left">
          <div className="page-header-eyebrow">Control Center</div>
          <h1 className="page-header-title">Production Dashboard</h1>
          <p className="page-header-subtitle">Real-time overview — {mockCurrentShift.date}</p>
        </div>
      </div>

      <div className="dashboard-kpi-row">
        <KPICard label="Orders Due Today" value={kpis.ordersDueToday.value} delta={kpis.ordersDueToday.delta} trend={kpis.ordersDueToday.trend} color="blue"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /></svg>} />
        <KPICard label="In Progress" value={kpis.inProgress.value} delta={kpis.inProgress.delta} trend={kpis.inProgress.trend} color="teal"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>} />
        <KPICard label="Completed Today" value={kpis.completedToday.value} delta={kpis.completedToday.delta} trend={kpis.completedToday.trend} color="green"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>} />
        <KPICard label="Quality Issues" value={kpis.qualityIssues.value} delta={kpis.qualityIssues.delta} trend={kpis.qualityIssues.trend} color="red"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>} />
      </div>

      {/* OEE Row */}
      <div className="dashboard-kpi-row" style={{ marginBottom: "var(--space-5)" }}>
        {[
          { label: "OEE", value: kpis.oee.value, unit: "%", delta: kpis.oee.delta, color: "#1e40af" },
          { label: "Availability", value: kpis.availability.value, unit: "%", delta: kpis.availability.delta, color: "#059669" },
          { label: "Performance", value: kpis.performance.value, unit: "%", delta: kpis.performance.delta, color: "#d97706" },
          { label: "Quality Rate", value: kpis.quality.value, unit: "%", delta: kpis.quality.delta, color: "#0d9488" },
        ].map(metric => (
          <div key={metric.label} className="card" style={{ padding: "var(--space-5)" }}>
            <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--space-3)" }}>
              {metric.label}
            </div>
            <div style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: metric.color, letterSpacing: "-0.04em", lineHeight: 1 }}>
              {metric.value}<span style={{ fontSize: "0.5em", marginLeft: 2 }}>{metric.unit}</span>
            </div>
            <div style={{ marginTop: "var(--space-3)" }}>
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${metric.value}%`, background: metric.color }}
                />
              </div>
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: "var(--space-2)" }}>
              {metric.delta} vs yesterday
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
              <div className="card-subtitle">Units per hour · Today Morning Shift</div>
            </div>
          </div>
          <div className="card-body" style={{ padding: "var(--space-4) var(--space-5)" }}>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={mockProductionTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e40af" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1e40af" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="target" name="Target" stroke="#1e40af" strokeWidth={2} fill="url(#gradTarget)" strokeDasharray="5 4" />
                <Area type="monotone" dataKey="actual" name="Actual" stroke="#059669" strokeWidth={2} fill="url(#gradActual)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="card grid-col-4">
          <div className="card-header">
            <div>
              <div className="card-title">Active Alerts</div>
              <div className="card-subtitle">{mockAlerts.length} requiring attention</div>
            </div>
            <span className="badge badge-danger">{mockAlerts.length} Active</span>
          </div>
          <div className="card-body" style={{ padding: "var(--space-4)" }}>
            <div className="alert-list">
              {mockAlerts.map(alert => (
                <div key={alert.id} className={`alert-row alert-${alert.type}`}>
                  <span className="alert-row-icon">{alert.icon}</span>
                  <div className="alert-row-content">
                    <div className="alert-row-title">{alert.title}</div>
                    <div className="alert-row-meta">{alert.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Machine Status */}
        <div className="card grid-col-8">
          <div className="card-header">
            <div>
              <div className="card-title">Machine Status</div>
              <div className="card-subtitle">12 assets · {mockMachines.filter(m => m.status === "running").length} running</div>
            </div>
            <div style={{ display: "flex", gap: 12, fontSize: "var(--text-xs)" }}>
              {[["dot-green", "Running"], ["dot-amber", "Idle"], ["dot-red", "Down"], ["dot-blue", "Setup"]].map(([cls, label]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--color-text-muted)" }}>
                  <span className={`status-dot ${cls}`} />{label}
                </div>
              ))}
            </div>
          </div>
          <div className="card-body">
            <div className="machine-grid">
              {mockMachines.map(m => <MachineCard key={m.id} machine={m} />)}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card grid-col-4">
          <div className="card-header">
            <div className="card-title">Production Activity</div>
          </div>
          <div className="card-body" style={{ padding: "var(--space-4) var(--space-5)" }}>
            <div className="timeline">
              {mockActivityFeed.map(item => (
                <div key={item.id} className="timeline-item">
                  <div className="timeline-line">
                    <div className={`timeline-dot timeline-dot-${item.type}`}>
                      <span style={{ fontSize: 10 }}>{item.icon}</span>
                    </div>
                    <div className="timeline-connector" />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title">{item.title}</div>
                    <div className="timeline-meta">{item.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Orders */}
        <div className="card grid-col-12">
          <div className="card-header">
            <div>
              <div className="card-title">Active & Upcoming Orders</div>
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
                {upcomingOrders.map(order => {
                  const pct = order.qty > 0 ? Math.round((order.completed / order.qty) * 100) : 0
                  const priorityClass = { Critical: "priority-critical", High: "priority-high", Medium: "priority-medium", Low: "priority-low" }
                  return (
                    <tr key={order.id}>
                      <td><span className="order-number">{order.id}</span></td>
                      <td className="table-cell-strong">{order.product}</td>
                      <td>{order.completed} / {order.qty}</td>
                      <td style={{ minWidth: 120 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div className="progress-bar-track" style={{ flex: 1 }}>
                            <div className="progress-bar-fill progress-blue" style={{ width: `${pct}%` }} />
                          </div>
                          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", minWidth: 30 }}>{pct}%</span>
                        </div>
                      </td>
                      <td><StatusBadge status={order.status} /></td>
                      <td><span className={`badge ${priorityClass[order.priority]}`}>{order.priority}</span></td>
                      <td style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>{order.dueDate}</td>
                      <td><span className="chip">{order.workcenter}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
