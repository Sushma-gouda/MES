import { useState } from "react"
import { Play, CheckSquare, Clock, Wrench } from "lucide-react"
import { mockSetupChecklist, mockMachines } from "../../data/mockData"
import "../../styles/pages.css"
import "../../styles/components.css"

function MachineSetup() {
  const [checklist, setChecklist] = useState(mockSetupChecklist)
  
  const setupMachine = mockMachines.find(m => m.status === "setup") || mockMachines[5] // Default to Grinder 1 if none in setup

  const completedTasks = checklist.filter(t => t.status === "done").length
  const totalTasks = checklist.length
  const progressPct = Math.round((completedTasks / totalTasks) * 100)

  const toggleTask = (id) => {
    setChecklist(checklist.map(t => {
      if (t.id === id) {
        if (t.status === "pending") return { ...t, status: "in-progress" }
        if (t.status === "in-progress") return { ...t, status: "done", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
        return { ...t, status: "pending", time: "—" }
      }
      return t
    }))
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-eyebrow">Execute</div>
          <h1 className="page-header-title">Machine Setup</h1>
          <p className="page-header-subtitle">Standard Operating Procedure for Job Changeover.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "var(--space-6)" }}>
        
        {/* Left Column: Checklist */}
        <div className="card">
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div className="card-title">Setup Checklist</div>
              <div className="card-subtitle">Job: {setupMachine.job} on {setupMachine.name}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-brand-primary)", marginBottom: 4 }}>
                {progressPct}% Completed
              </div>
              <div style={{ width: 120, height: 6, background: "var(--color-bg-muted)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${progressPct}%`, height: "100%", background: "var(--color-brand-primary)", transition: "width 0.3s ease" }} />
              </div>
            </div>
          </div>
          
          <div className="card-body" style={{ padding: "var(--space-2) 0" }}>
            {checklist.map((task) => (
              <div 
                key={task.id} 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "var(--space-3) var(--space-5)", 
                  borderBottom: "1px solid var(--color-border)",
                  background: task.status === "done" ? "var(--color-bg-muted)" : "transparent",
                  opacity: task.status === "done" ? 0.7 : 1
                }}
              >
                <button 
                  onClick={() => toggleTask(task.id)}
                  style={{ 
                    width: 24, height: 24, borderRadius: 4, 
                    border: `2px solid ${task.status === 'done' ? 'var(--color-status-success)' : 'var(--color-border-strong)'}`,
                    background: task.status === 'done' ? 'var(--color-status-success)' : 'transparent',
                    color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", marginRight: "var(--space-4)"
                  }}
                >
                  {task.status === "done" && <CheckSquare size={16} />}
                  {task.status === "in-progress" && <div style={{ width: 10, height: 10, background: "var(--color-brand-primary)", borderRadius: 2 }} />}
                </button>
                
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: 500, 
                    fontSize: "var(--text-md)",
                    textDecoration: task.status === "done" ? "line-through" : "none" 
                  }}>
                    {task.task}
                  </div>
                  {task.status !== "pending" && (
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: 2 }}>
                      By: {task.by} {task.time !== "—" && `· ${task.time}`}
                    </div>
                  )}
                </div>

                <div>
                  <span className={`badge ${task.status === 'done' ? 'badge-success' : task.status === 'in-progress' ? 'badge-info' : 'badge-neutral'}`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="card-footer" style={{ padding: "var(--space-4)", display: "flex", justifyContent: "space-between" }}>
            <button className="btn btn-secondary">Report Issue</button>
            <button className="btn btn-primary" disabled={progressPct < 100}>
              <Play size={16} /> Release to Production
            </button>
          </div>
        </div>

        {/* Right Column: Context */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          
          {/* Active Workcenter */}
          <div className="card" style={{ padding: "var(--space-4)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "var(--space-4)" }}>
              <div style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: "var(--color-status-info-bg)", color: "var(--color-status-info)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Wrench size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "var(--text-lg)" }}>{setupMachine.name}</div>
                <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>{setupMachine.id}</div>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
              <div style={{ flex: 1, padding: "var(--space-3)", background: "var(--color-bg-muted)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: 4 }}>Target Setup Time</div>
                <div style={{ fontWeight: 600, fontSize: "var(--text-lg)", display: "flex", alignItems: "center", gap: 6 }}>
                  <Clock size={16} style={{ color: "var(--color-status-warning)" }}/> 45 min
                </div>
              </div>
              <div style={{ flex: 1, padding: "var(--space-3)", background: "var(--color-bg-muted)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: 4 }}>Elapsed Time</div>
                <div style={{ fontWeight: 600, fontSize: "var(--text-lg)", color: "var(--color-status-danger)" }}>
                  28 min
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-3)" }}>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: 4 }}>Next Job</div>
              <div style={{ fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
                <span className="order-number">{setupMachine.job}</span>
                <span className="badge priority-low">Low Priority</span>
              </div>
            </div>
          </div>

          {/* Tooling Requirements */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Required Tooling</div>
            </div>
            <div className="card-body" style={{ padding: "0 var(--space-4) var(--space-4) var(--space-4)" }}>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {["Fixture FX-2201", "CNMG Carbide Insert (T01)", "Face Mill 50mm (T02)", "U-Drill 20mm (T05)"].map((tool, i) => (
                  <li key={i} style={{ padding: "var(--space-2) 0", borderBottom: "1px dashed var(--color-border)", fontSize: "var(--text-sm)", display: "flex", justifyContent: "space-between" }}>
                    <span>{tool}</span>
                    <span style={{ color: "var(--color-status-success)", fontWeight: 500 }}>Ready</span>
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

export default MachineSetup
