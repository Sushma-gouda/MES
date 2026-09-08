import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts"
import { mockOEEData, mockDowntime } from "../../data/mockData"
import "../../styles/pages.css"
import "../../styles/components.css"

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#fff" }}>
        <div style={{ marginBottom: 6, fontWeight: 600, color: "#94a3b8" }}>{label}</div>
        {payload.map(p => (
          <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />
            <span style={{ color: "#cbd5e1" }}>{p.name}:</span>
            <span style={{ fontWeight: 600 }}>{p.value}%</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

function OEEMonitoring() {
  const latestOEE = mockOEEData[mockOEEData.length - 1]



  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-eyebrow">Monitor & Assure</div>
          <h1 className="page-header-title">OEE & Performance</h1>
          <p className="page-header-subtitle">Overall Equipment Effectiveness across the plant.</p>
        </div>
      </div>

      {/* Top OEE Metrics */}
      <div className="dashboard-kpi-row" style={{ marginBottom: "var(--space-6)" }}>
        <div className="card" style={{ padding: "var(--space-6)", textAlign: "center", background: "var(--color-bg-sidebar)", color: "white" }}>
          <div style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-2)" }}>Overall OEE</div>
          <div style={{ fontSize: "4rem", fontWeight: 800, lineHeight: 1 }}>{latestOEE.oee}<span style={{ fontSize: "2rem" }}>%</span></div>
          <div style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.7)", marginTop: "var(--space-2)" }}>Plant Average · Today</div>
        </div>

        <div className="card" style={{ padding: "var(--space-6)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-2)" }}>Availability</div>
          <div style={{ fontSize: "var(--text-4xl)", fontWeight: 800, color: "var(--color-status-info)", lineHeight: 1, marginBottom: "var(--space-3)" }}>{latestOEE.availability}%</div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill progress-blue" style={{ width: `${latestOEE.availability}%` }} />
          </div>
        </div>
        
        <div className="card" style={{ padding: "var(--space-6)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-2)" }}>Performance</div>
          <div style={{ fontSize: "var(--text-4xl)", fontWeight: 800, color: "var(--color-status-warning)", lineHeight: 1, marginBottom: "var(--space-3)" }}>{latestOEE.performance}%</div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill progress-amber" style={{ width: `${latestOEE.performance}%` }} />
          </div>
        </div>

        <div className="card" style={{ padding: "var(--space-6)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-2)" }}>Quality</div>
          <div style={{ fontSize: "var(--text-4xl)", fontWeight: 800, color: "var(--color-status-success)", lineHeight: 1, marginBottom: "var(--space-3)" }}>{latestOEE.quality}%</div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill progress-green" style={{ width: `${latestOEE.quality}%` }} />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--space-6)" }}>
        
        {/* Trend Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">OEE Trend (Last 7 Days)</div>
          </div>
          <div className="card-body" style={{ padding: "var(--space-4)", height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockOEEData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} domain={[60, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <ReferenceLine y={85} stroke="var(--color-status-success)" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'World Class Target (85%)', fill: 'var(--color-status-success)', fontSize: 12 }} />
                <Bar dataKey="availability" name="Availability" stackId="a" fill="#0284c7" radius={[0, 0, 4, 4]} />
                <Bar dataKey="performance" name="Performance" stackId="a" fill="#d97706" />
                <Bar dataKey="quality" name="Quality" stackId="a" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Downtime Reasons */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Top Loss Reasons</div>
            <div className="card-subtitle">By Duration (Minutes)</div>
          </div>
          <div className="card-body" style={{ padding: "var(--space-4)" }}>
            {mockDowntime.map((dt, idx) => (
              <div key={idx} style={{ marginBottom: "var(--space-4)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)", marginBottom: 4 }}>
                  <span style={{ fontWeight: 500 }}>{dt.reason}</span>
                  <span style={{ fontWeight: 600, color: "var(--color-status-danger)" }}>{dt.minutes} min</span>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill progress-red" style={{ width: `${dt.percent}%` }} />
                </div>
                <div style={{ fontSize: "10px", color: "var(--color-text-muted)", marginTop: 2, textAlign: "right" }}>{dt.percent}% of total downtime</div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default OEEMonitoring
