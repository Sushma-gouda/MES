import { useState } from "react"
import { Users, FileText, CheckCircle2, AlertCircle } from "lucide-react"
import { mockHandoffs } from "../../data/mockData"
import "../../styles/pages.css"
import "../../styles/components.css"

function OperationHandoff() {
  const [handoff] = useState(mockHandoffs[0])
  const [acknowledged, setAcknowledged] = useState(false)

  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: "var(--space-6)" }}>
        <div className="page-header-left">
          <div className="page-header-eyebrow">Monitor & Assure</div>
          <h1 className="page-header-title">Shift Hand-off</h1>
          <p className="page-header-subtitle">Standardized transfer of information between shifts.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--space-6)" }}>
        
        {/* Handoff Details */}
        <div className="card">
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--color-bg-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Users size={24} style={{ color: "var(--color-brand-primary)" }} />
              </div>
              <div>
                <div style={{ fontSize: "var(--text-lg)", fontWeight: 700 }}>{handoff.from} &rarr; {handoff.to}</div>
                <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>Logged: {handoff.date} by {handoff.supervisor}</div>
              </div>
            </div>
            {acknowledged ? (
              <span className="badge badge-success"><CheckCircle2 size={14} style={{ marginRight: 4 }} /> Acknowledged</span>
            ) : (
              <span className="badge badge-warning">Pending Acknowledgement</span>
            )}
          </div>
          
          <div className="card-body" style={{ padding: "var(--space-6)" }}>
            
            <div style={{ marginBottom: "var(--space-6)" }}>
              <h3 style={{ fontSize: "var(--text-md)", fontWeight: 600, marginBottom: "var(--space-3)", display: "flex", alignItems: "center", gap: 8 }}>
                <FileText size={18} style={{ color: "var(--color-text-muted)" }} /> 
                Shift Supervisor Notes
              </h3>
              <div style={{ background: "var(--color-bg-muted)", padding: "var(--space-4)", borderRadius: "var(--radius-md)", color: "var(--color-text-secondary)", fontStyle: "italic", borderLeft: "4px solid var(--color-border-strong)" }}>
                "{handoff.notes}"
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)", marginBottom: "var(--space-6)" }}>
              <div>
                <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase", marginBottom: "var(--space-3)" }}>Completed Orders</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                  {handoff.completedOrders.map(id => (
                    <span key={id} className="badge badge-success">{id}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase", marginBottom: "var(--space-3)" }}>In-Progress Orders</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                  {handoff.inProgressOrders.map(id => (
                    <span key={id} className="badge badge-info">{id}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "var(--space-6)" }}>
              <h3 style={{ fontSize: "var(--text-md)", fontWeight: 600, marginBottom: "var(--space-3)", display: "flex", alignItems: "center", gap: 8, color: "var(--color-status-danger)" }}>
                <AlertCircle size={18} /> 
                Escalated Issues / Maintenance
              </h3>
              <div style={{ background: "var(--color-status-danger-bg)", color: "var(--color-status-danger)", padding: "var(--space-4)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-status-danger-border)" }}>
                {handoff.issues}
              </div>
            </div>

          </div>
          
          <div className="card-footer" style={{ padding: "var(--space-4) var(--space-6)", background: "var(--color-bg-muted)", display: "flex", justifyContent: "flex-end" }}>
            <button 
              className={`btn ${acknowledged ? 'btn-secondary' : 'btn-primary'}`} 
              onClick={() => setAcknowledged(true)}
              disabled={acknowledged}
            >
              {acknowledged ? "Hand-off Accepted" : "Acknowledge & Accept Hand-off"}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="card" style={{ height: "fit-content" }}>
          <div className="card-header">
            <div className="card-title">Material Shortages</div>
            <div className="card-subtitle">Reported from previous shift</div>
          </div>
          <div className="card-body" style={{ padding: "0 var(--space-4) var(--space-4) var(--space-4)" }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {handoff.materialShortages.map((mat, i) => (
                <li key={i} style={{ padding: "var(--space-3) 0", borderBottom: "1px dashed var(--color-border)", fontSize: "var(--text-sm)" }}>
                  <span style={{ color: "var(--color-status-danger)", fontWeight: 600 }}>!</span> {mat}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  )
}

export default OperationHandoff
