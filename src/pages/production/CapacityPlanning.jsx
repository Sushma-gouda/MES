import { AlertTriangle, TrendingUp, BarChart2 } from "lucide-react"
import { mockCapacity } from "../../data/mockData"
import "../../styles/pages.css"
import "../../styles/components.css"

function CapacityPlanning() {
  const averageUtilization = Math.round(
    mockCapacity.reduce((acc, curr) => acc + curr.utilization, 0) / mockCapacity.length
  )

  const bottlenecks = mockCapacity.filter(c => c.utilization >= 90)
  const underutilized = mockCapacity.filter(c => c.utilization < 50)

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-eyebrow">Plan & Release</div>
          <h1 className="page-header-title">Capacity Planning</h1>
          <p className="page-header-subtitle">Monitor resource utilization and identify bottlenecks.</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-secondary">
            Simulate Capacity
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-kpi-row" style={{ marginBottom: "var(--space-6)" }}>
        <div className="card" style={{ padding: "var(--space-5)", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--color-status-info-bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-status-info)" }}>
            <BarChart2 size={24} />
          </div>
          <div>
            <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", fontWeight: 500 }}>Avg Utilization</div>
            <div style={{ fontSize: "var(--text-2xl)", fontWeight: 700 }}>{averageUtilization}%</div>
          </div>
        </div>
        
        <div className="card" style={{ padding: "var(--space-5)", display: "flex", alignItems: "center", gap: "var(--space-4)", borderLeft: bottlenecks.length > 0 ? "4px solid var(--color-status-danger)" : "" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--color-status-danger-bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-status-danger)" }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", fontWeight: 500 }}>Bottlenecks (&gt;90%)</div>
            <div style={{ fontSize: "var(--text-2xl)", fontWeight: 700, color: bottlenecks.length > 0 ? "var(--color-status-danger)" : "inherit" }}>
              {bottlenecks.length} <span style={{ fontSize: "var(--text-sm)", fontWeight: 400, color: "var(--color-text-muted)" }}>Resources</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: "var(--space-5)", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--color-status-warning-bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-status-warning)" }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", fontWeight: 500 }}>Underutilized (&lt;50%)</div>
            <div style={{ fontSize: "var(--text-2xl)", fontWeight: 700 }}>
              {underutilized.length} <span style={{ fontSize: "var(--text-sm)", fontWeight: 400, color: "var(--color-text-muted)" }}>Resources</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Workcenter Capacity Breakdown</div>
          <div className="card-subtitle">Current Shift (8 hours)</div>
        </div>
        
        <div className="table-wrapper" style={{ border: "none", borderRadius: 0, boxShadow: "none" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Resource / Machine</th>
                <th>Available (Hrs)</th>
                <th>Planned (Hrs)</th>
                <th>Utilization</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockCapacity.map(resource => {
                let status = "Optimal"
                let statusClass = "badge-success"
                let progressClass = "progress-green"
                
                if (resource.utilization >= 90) {
                  status = "Overloaded"
                  statusClass = "badge-danger"
                  progressClass = "progress-red"
                } else if (resource.utilization < 50) {
                  status = "Underutilized"
                  statusClass = "badge-warning"
                  progressClass = "progress-amber"
                }

                return (
                  <tr key={resource.resource}>
                    <td><span className="chip" style={{ fontWeight: 600 }}>{resource.resource}</span></td>
                    <td>{resource.available.toFixed(1)}</td>
                    <td style={{ fontWeight: 500 }}>{resource.used.toFixed(1)}</td>
                    <td style={{ minWidth: 200 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div className="progress-bar-track" style={{ flex: 1, height: 8 }}>
                          <div className={`progress-bar-fill ${progressClass}`} style={{ width: `${Math.min(resource.utilization, 100)}%` }} />
                        </div>
                        <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, minWidth: 40, textAlign: "right" }}>
                          {resource.utilization}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${statusClass}`}>{status}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CapacityPlanning
