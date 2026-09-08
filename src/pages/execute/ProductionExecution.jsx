import { useState, useEffect } from "react"
import { Play, Pause, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react"
import { mockProductionOrders, mockOperations } from "../../data/mockData"
import "../../styles/pages.css"
import "../../styles/components.css"

function ProductionExecution() {
  const activeOrder = mockProductionOrders.find(o => o.status === "In Progress") || mockProductionOrders[0]
  const activeOperation = mockOperations.find(o => o.status === "In Progress") || mockOperations[2]

  const [produced, setProduced] = useState(activeOrder.completed)
  const [rejected, setRejected] = useState(2)
  const [status, setStatus] = useState("running") // running, paused
  const [cycleTime, setCycleTime] = useState(58) // seconds

  const target = activeOrder.qty
  const remaining = target - produced

  const progressPct = Math.round((produced / target) * 100)

  // Simulate production count if running
  useEffect(() => {
    let interval
    if (status === "running" && produced < target) {
      interval = setInterval(() => {
        setProduced(prev => Math.min(prev + 1, target))
        // Randomly fluctuate cycle time slightly
        setCycleTime(prev => Math.max(50, Math.min(70, prev + (Math.random() > 0.5 ? 1 : -1))))
      }, 5000) // Fast simulation
    }
    return () => clearInterval(interval)
  }, [status, produced, target])

  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: "var(--space-4)" }}>
        <div className="page-header-left">
          <div className="page-header-eyebrow">Execute</div>
          <h1 className="page-header-title">Operator Terminal</h1>
          <p className="page-header-subtitle">Active Job Execution</p>
        </div>
        <div className="page-header-right">
          <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
            <span className={`status-dot ${status === 'running' ? 'dot-green dot-live' : 'dot-amber'}`} />
            <span style={{ fontWeight: 600, color: status === 'running' ? "var(--color-status-success)" : "var(--color-status-warning)", textTransform: "capitalize" }}>
              {status}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "var(--space-6)" }}>
        
        {/* Left: Execution Context & Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          
          {/* Job Info Card */}
          <div className="card" style={{ padding: "var(--space-6)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", background: "linear-gradient(to right, var(--color-bg-surface), #f8fafc)" }}>
            <div>
              <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", marginBottom: "var(--space-2)" }}>
                <span className="order-number" style={{ fontSize: "var(--text-xl)" }}>{activeOrder.id}</span>
                <span className="chip">{activeOrder.workcenter}</span>
                <span className="badge priority-high">{activeOrder.priority} Priority</span>
              </div>
              <div style={{ fontSize: "var(--text-2xl)", fontWeight: 700, marginBottom: "var(--space-1)" }}>{activeOrder.product}</div>
              <div style={{ color: "var(--color-text-secondary)" }}>Part: {activeOrder.partNo}</div>
              
              <div style={{ marginTop: "var(--space-4)", display: "inline-flex", gap: "var(--space-4)", background: "var(--color-bg-muted)", padding: "var(--space-3)", borderRadius: "var(--radius-md)" }}>
                <div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Current Operation</div>
                  <div style={{ fontWeight: 600, color: "var(--color-brand-primary)" }}>OP-{activeOperation.seq}: {activeOperation.name}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Large Counters */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-4)" }}>
            <div className="card" style={{ padding: "var(--space-6)", textAlign: "center" }}>
              <div style={{ color: "var(--color-text-secondary)", fontWeight: 500, marginBottom: "var(--space-2)" }}>Produced</div>
              <div style={{ fontSize: "var(--text-6xl)", fontWeight: 800, color: "var(--color-status-success)", lineHeight: 1 }}>{produced}</div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-2)" }}>Target: {target}</div>
            </div>
            
            <div className="card" style={{ padding: "var(--space-6)", textAlign: "center" }}>
              <div style={{ color: "var(--color-text-secondary)", fontWeight: 500, marginBottom: "var(--space-2)" }}>Remaining</div>
              <div style={{ fontSize: "var(--text-6xl)", fontWeight: 800, color: "var(--color-status-info)", lineHeight: 1 }}>{remaining}</div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-2)" }}>To complete order</div>
            </div>
            
            <div className="card" style={{ padding: "var(--space-6)", textAlign: "center" }}>
              <div style={{ color: "var(--color-text-secondary)", fontWeight: 500, marginBottom: "var(--space-2)" }}>Rejected</div>
              <div style={{ fontSize: "var(--text-6xl)", fontWeight: 800, color: "var(--color-status-danger)", lineHeight: 1 }}>{rejected}</div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-2)" }}>Scrap / Rework</div>
            </div>
          </div>

          {/* Progress & Cycle Time */}
          <div className="card" style={{ padding: "var(--space-5)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
              <div style={{ fontWeight: 600 }}>Production Progress</div>
              <div style={{ fontWeight: 700, color: "var(--color-brand-primary)" }}>{progressPct}%</div>
            </div>
            <div className="progress-bar-track" style={{ height: 16, borderRadius: 8 }}>
              <div className="progress-bar-fill progress-blue" style={{ width: `${progressPct}%`, borderRadius: 8, transition: "width 0.5s ease" }} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-around", marginTop: "var(--space-6)", paddingTop: "var(--space-4)", borderTop: "1px solid var(--color-border)" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: 4 }}>Current Cycle Time</div>
                <div style={{ fontSize: "var(--text-2xl)", fontWeight: 700, color: cycleTime > 60 ? "var(--color-status-warning)" : "var(--color-status-success)" }}>{cycleTime}s</div>
              </div>
              <div style={{ width: 1, background: "var(--color-border)" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: 4 }}>Target Cycle Time</div>
                <div style={{ fontSize: "var(--text-2xl)", fontWeight: 700 }}>60s</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right: Actions & Reporting */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          
          {/* Primary Controls */}
          <div className="card" style={{ padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-2)" }}>Machine Controls</div>
            
            {status === "paused" ? (
              <button 
                className="btn btn-primary" 
                style={{ padding: "var(--space-4)", fontSize: "var(--text-lg)", justifyContent: "center" }}
                onClick={() => setStatus("running")}
              >
                <Play size={24} style={{ marginRight: 8 }} /> Resume Production
              </button>
            ) : (
              <button 
                className="btn" 
                style={{ background: "var(--color-status-warning)", color: "white", border: "none", padding: "var(--space-4)", fontSize: "var(--text-lg)", justifyContent: "center" }}
                onClick={() => setStatus("paused")}
              >
                <Pause size={24} style={{ marginRight: 8 }} /> Pause Production
              </button>
            )}

            <button className="btn btn-secondary" style={{ padding: "var(--space-3)", justifyContent: "center", marginTop: "var(--space-2)" }}>
              <CheckCircle size={18} style={{ marginRight: 8 }} /> Complete Operation
            </button>
          </div>

          {/* Quick Reporting */}
          <div className="card" style={{ padding: "var(--space-5)" }}>
             <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-4)" }}>Quick Reporting</div>
             
             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
               <button 
                 className="btn btn-secondary" 
                 style={{ height: 80, flexDirection: "column", gap: 8, color: "var(--color-status-danger)", borderColor: "var(--color-status-danger-border)", background: "var(--color-status-danger-bg)" }}
                 onClick={() => setRejected(r => r + 1)}
               >
                 <AlertCircle size={24} />
                 <span>Report Defect</span>
               </button>
               
               <button className="btn btn-secondary" style={{ height: 80, flexDirection: "column", gap: 8 }}>
                 <AlertTriangle size={24} style={{ color: "var(--color-status-warning)" }}/>
                 <span>Log Downtime</span>
               </button>
             </div>
          </div>

          {/* Current BOM / Materials */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Material Consumption</div>
            </div>
            <div className="card-body" style={{ padding: "0 var(--space-4) var(--space-4) var(--space-4)" }}>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {["Housing Body (Cast Iron)", "Bearing 6208 ZZ"].map((mat, i) => (
                  <li key={i} style={{ padding: "var(--space-3) 0", borderBottom: "1px dashed var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: "var(--text-sm)" }}>{mat}</div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Auto-backflush</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 600 }}>{produced * (i+1)} EA</div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-status-success)" }}>Available</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProductionExecution
