import { Activity, AlertTriangle, Cpu, Factory } from "lucide-react"
import { mockLiveStats, mockMachines, mockAlerts } from "../../data/mockData"
import "../../styles/pages.css"
import "../../styles/components.css"

function MachineStatusCard({ machine }) {
  const statusColor = { running: "green", idle: "amber", down: "red", setup: "blue", maintenance: "purple" }
  const color = statusColor[machine.status] || "gray"
  
  return (
    <div className={`card`} style={{ borderTop: `4px solid var(--color-status-${color === 'green' ? 'success' : color === 'red' ? 'danger' : color === 'amber' ? 'warning' : 'info'})` }}>
      <div className="card-body" style={{ padding: "var(--space-4)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-3)" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: "var(--text-lg)" }}>{machine.name}</div>
            <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-xs)" }}>{machine.id}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--color-bg-muted)", padding: "4px 8px", borderRadius: "var(--radius-full)" }}>
            <span className={`status-dot dot-${color}`} />
            <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, textTransform: "capitalize" }}>{machine.status}</span>
          </div>
        </div>
        
        <div style={{ minHeight: 48 }}>
          {machine.job ? (
            <div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: 2 }}>Current Job</div>
              <div className="order-number" style={{ fontSize: "var(--text-sm)" }}>{machine.job}</div>
            </div>
          ) : machine.issue ? (
            <div style={{ color: "var(--color-status-danger)", fontSize: "var(--text-sm)", display: "flex", alignItems: "center", gap: 4 }}>
              <AlertTriangle size={14} /> {machine.issue}
            </div>
          ) : (
            <div style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)", fontStyle: "italic" }}>No active job</div>
          )}
        </div>
        
        {machine.uptime !== "—" && (
          <div style={{ marginTop: "var(--space-3)", borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", marginBottom: 4 }}>
              <span style={{ color: "var(--color-text-muted)" }}>Uptime</span>
              <span style={{ fontWeight: 600 }}>{machine.uptime}</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill progress-green" style={{ width: machine.uptime }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function LiveMonitoring() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-eyebrow">Monitor & Control</div>
          <h1 className="page-header-title">Live Shop-Floor</h1>
          <p className="page-header-subtitle">Real-time equipment status and plant overview.</p>
        </div>
        <div className="page-header-right">
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(5, 150, 105, 0.1)", color: "var(--color-status-success)", padding: "8px 12px", borderRadius: "var(--radius-md)", fontWeight: 600, fontSize: "var(--text-sm)" }}>
            <span className="status-dot dot-green dot-live" /> Live Updates Active
          </div>
        </div>
      </div>

      <div className="dashboard-kpi-row" style={{ marginBottom: "var(--space-6)" }}>
        <div className="card" style={{ padding: "var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--color-bg-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Factory size={20} />
          </div>
          <div>
            <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", fontWeight: 500 }}>Total Assets</div>
            <div style={{ fontSize: "var(--text-2xl)", fontWeight: 700 }}>{mockLiveStats.totalMachines}</div>
          </div>
        </div>
        
        <div className="card" style={{ padding: "var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--color-status-success-bg)", color: "var(--color-status-success)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Activity size={20} />
          </div>
          <div>
            <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", fontWeight: 500 }}>Running</div>
            <div style={{ fontSize: "var(--text-2xl)", fontWeight: 700 }}>{mockLiveStats.running}</div>
          </div>
        </div>

        <div className="card" style={{ padding: "var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--color-status-danger-bg)", color: "var(--color-status-danger)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", fontWeight: 500 }}>Down</div>
            <div style={{ fontSize: "var(--text-2xl)", fontWeight: 700 }}>{mockLiveStats.down}</div>
          </div>
        </div>

        <div className="card" style={{ padding: "var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--color-status-info-bg)", color: "var(--color-status-info)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Cpu size={20} />
          </div>
          <div>
            <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", fontWeight: 500 }}>Setup / Maint</div>
            <div style={{ fontSize: "var(--text-2xl)", fontWeight: 700 }}>{mockLiveStats.setup + mockLiveStats.maintenance}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "var(--space-6)" }}>
        
        {/* Machine Grid */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
            <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 600 }}>Equipment Status</h2>
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <select className="form-input" style={{ padding: "4px 8px", fontSize: "var(--text-xs)", height: "auto" }}>
                <option>All Zones</option>
                <option>CNC Area</option>
                <option>Assembly Line</option>
              </select>
            </div>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "var(--space-4)" }}>
            {mockMachines.map(machine => (
              <MachineStatusCard key={machine.id} machine={machine} />
            ))}
          </div>
        </div>

        {/* Live Alerts Stream */}
        <div>
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
            <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 600 }}>Live Alerts</h2>
            <span className="badge badge-danger">{mockAlerts.length} Active</span>
          </div>
          
          <div className="card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div className="alert-list" style={{ padding: "var(--space-2)" }}>
              {mockAlerts.map(alert => (
                <div key={alert.id} className={`alert-row alert-${alert.type}`} style={{ margin: "var(--space-2)", borderRadius: "var(--radius-sm)" }}>
                  <span className="alert-row-icon">{alert.icon}</span>
                  <div className="alert-row-content">
                    <div className="alert-row-title">{alert.title}</div>
                    <div className="alert-row-meta">{alert.meta}</div>
                  </div>
                </div>
              ))}
              
              <div style={{ padding: "var(--space-4)", textAlign: "center" }}>
                <button className="btn btn-secondary" style={{ fontSize: "var(--text-xs)" }}>View All History</button>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default LiveMonitoring
