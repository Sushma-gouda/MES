import { useState, useEffect } from "react"
import { AlertTriangle, TrendingUp, BarChart2, CheckCircle, XCircle, X } from "lucide-react"
import "../../styles/pages.css"
import "../../styles/components.css"

function CapacityPlanning() {
  const [workCenters, setWorkCenters] = useState([])
  const [machineCapacities, setMachineCapacities] = useState([])
  const [schedules, setSchedules] = useState([])
  const [tools, setTools] = useState([])
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false)
  const [simulateFormData, setSimulateFormData] = useState({
    production_schedule_id: '',
    required_machine_hours: '',
    required_labor_hours: '',
    required_tool_id: '',
    required_tool_quantity: 0,
    required_start: '',
    required_end: '',
  })
  
  const [simulateLoading, setSimulateLoading] = useState(false)
  const [feasibilityResult, setFeasibilityResult] = useState(null)

  const getErrorMessage = (errorData, defaultMessage) => {
    if (errorData && errorData.detail) {
      if (typeof errorData.detail === 'string') {
        return errorData.detail;
      }
      if (Array.isArray(errorData.detail)) {
        return errorData.detail.map(e => e.msg).join(', ');
      }
      return JSON.stringify(errorData.detail);
    }
    return defaultMessage;
  }

  const fetchAllData = async () => {
    setError(null)
    const token = localStorage.getItem("access_token")
    if (!token) {
      setError("No access token found. Please login.")
      setLoading(false)
      return
    }

    const headers = {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }

    try {
      const [wcRes, mcRes, schedRes, toolsRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/production-schedules/work-centers", { headers }),
        fetch("http://127.0.0.1:8000/capacity-planning/machine-capacities", { headers }),
        fetch("http://127.0.0.1:8000/production-schedules/", { headers }),
        fetch("http://127.0.0.1:8000/capacity-planning/tools", { headers })
      ])

      if (!wcRes.ok || !mcRes.ok || !schedRes.ok || !toolsRes.ok) {
        throw new Error("Failed to fetch data from backend.")
      }

      const wcData = await wcRes.json()
      const mcData = await mcRes.json()
      const schedData = await schedRes.json()
      const toolsData = await toolsRes.json()

      setWorkCenters(wcData)
      setMachineCapacities(mcData)
      setSchedules(schedData)
      setTools(toolsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAllData()
  }, [])

  const handleSimulate = async (e) => {
    e.preventDefault()
    setSimulateLoading(true)
    setFeasibilityResult(null)

    const token = localStorage.getItem("access_token")
    const headers = {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }

    try {
      const scheduleId = parseInt(simulateFormData.production_schedule_id)
      
      const payload = {
        production_schedule_id: scheduleId,
        required_machine_hours: parseFloat(simulateFormData.required_machine_hours),
        required_labor_hours: parseFloat(simulateFormData.required_labor_hours),
        required_tool_id: simulateFormData.required_tool_id ? parseInt(simulateFormData.required_tool_id) : null,
        required_tool_quantity: parseInt(simulateFormData.required_tool_quantity) || 0,
        required_start: new Date(simulateFormData.required_start).toISOString(),
        required_end: new Date(simulateFormData.required_end).toISOString(),
      }

      const reqRes = await fetch("http://127.0.0.1:8000/capacity-planning/requirements", {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      })

      if (!reqRes.ok) {
        const errData = await reqRes.json()
        throw new Error(getErrorMessage(errData, "Failed to create requirement"))
      }

      const chkRes = await fetch(`http://127.0.0.1:8000/capacity-planning/check/${scheduleId}`, {
        method: "POST",
        headers
      })

      if (!chkRes.ok) {
        const errData = await chkRes.json()
        throw new Error(getErrorMessage(errData, "Failed to check feasibility"))
      }

      const resultData = await chkRes.json()
      setFeasibilityResult(resultData)
      fetchAllData()
    } catch (err) {
      alert(err.message)
    } finally {
      setSimulateLoading(false)
    }
  }

  if (loading) {
    return <div className="page-container"><p>Loading capacity data...</p></div>
  }

  if (error) {
    return <div className="page-container"><p style={{ color: "red" }}>Error: {error}</p></div>
  }

  // Calculate Capacity Breakdown Data
  const breakdownData = workCenters.map(wc => {
    const capacities = machineCapacities.filter(mc => mc.work_center_id === wc.id);
    const available = capacities.reduce((sum, mc) => sum + parseFloat(mc.available_hours), 0);

    const wcSchedules = schedules.filter(s => s.work_center_id === wc.id);
    const plannedMs = wcSchedules.reduce((sum, s) => {
      const start = new Date(s.planned_start).getTime();
      const end = new Date(s.planned_end).getTime();
      return sum + Math.max(0, end - start);
    }, 0);
    const planned = plannedMs / (1000 * 60 * 60);

    let utilization = 0;
    if (available > 0) {
      utilization = (planned / available) * 100;
    } else if (planned > 0) {
      utilization = 100; // Overutilized with 0 available
    }

    return {
      resource: wc.code,
      name: wc.name,
      available,
      used: planned,
      utilization: Math.round(utilization)
    }
  })

  const averageUtilization = breakdownData.length > 0 
    ? Math.round(breakdownData.reduce((acc, curr) => acc + curr.utilization, 0) / breakdownData.length)
    : 0

  const bottlenecks = breakdownData.filter(c => c.utilization >= 90)
  const underutilized = breakdownData.filter(c => c.utilization < 50)

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
          <button className="btn btn-primary" onClick={() => {
            setSimulateFormData({
              production_schedule_id: '',
              required_machine_hours: '',
              required_labor_hours: '',
              required_tool_id: '',
              required_tool_quantity: 0,
              required_start: '',
              required_end: '',
            })
            setFeasibilityResult(null)
            setIsSimulateModalOpen(true)
          }}>
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
          <div className="card-subtitle">Aggregate Data Based on System Schedule</div>
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
              {breakdownData.map(resource => {
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
                    <td><span className="chip" style={{ fontWeight: 600 }} title={resource.name}>{resource.resource}</span></td>
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
              {breakdownData.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "var(--space-6)", color: "var(--color-text-secondary)" }}>
                    No work centers or capacity data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulate Modal */}
      {isSimulateModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div className="card" style={{ width: 600, padding: "var(--space-6)", maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
              <h3 style={{ margin: 0 }}>Simulate Capacity Feasibility</h3>
              <button className="btn btn-icon" onClick={() => setIsSimulateModalOpen(false)}><X size={16} /></button>
            </div>
            
            {!feasibilityResult ? (
              <form onSubmit={handleSimulate}>
                <div style={{ marginBottom: "var(--space-4)" }}>
                  <label style={{ display: "block", marginBottom: 8, fontSize: "var(--text-sm)" }}>Select Schedule</label>
                  <select 
                    className="form-input" 
                    style={{ width: "100%", padding: 8 }}
                    required
                    value={simulateFormData.production_schedule_id}
                    onChange={e => setSimulateFormData({...simulateFormData, production_schedule_id: e.target.value})}
                  >
                    <option value="">Select a production schedule...</option>
                    {schedules.map(s => (
                      <option key={s.id} value={s.id}>{s.order_number} ({s.product_name}) - {s.work_center_code}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-4)" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: 8, fontSize: "var(--text-sm)" }}>Req. Machine Hours</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="form-input" 
                      style={{ width: "100%", padding: 8 }}
                      required
                      value={simulateFormData.required_machine_hours}
                      onChange={e => setSimulateFormData({...simulateFormData, required_machine_hours: e.target.value})}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: 8, fontSize: "var(--text-sm)" }}>Req. Labor Hours</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="form-input" 
                      style={{ width: "100%", padding: 8 }}
                      required
                      value={simulateFormData.required_labor_hours}
                      onChange={e => setSimulateFormData({...simulateFormData, required_labor_hours: e.target.value})}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-4)" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: 8, fontSize: "var(--text-sm)" }}>Required Tool</label>
                    <select 
                      className="form-input" 
                      style={{ width: "100%", padding: 8 }}
                      value={simulateFormData.required_tool_id}
                      onChange={e => setSimulateFormData({...simulateFormData, required_tool_id: e.target.value})}
                    >
                      <option value="">None</option>
                      {tools.map(t => (
                        <option key={t.id} value={t.id}>{t.tool_name} ({t.tool_code})</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: 8, fontSize: "var(--text-sm)" }}>Tool Quantity</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      style={{ width: "100%", padding: 8 }}
                      value={simulateFormData.required_tool_quantity}
                      onChange={e => setSimulateFormData({...simulateFormData, required_tool_quantity: e.target.value})}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: 8, fontSize: "var(--text-sm)" }}>Required Start</label>
                    <input 
                      type="datetime-local" 
                      className="form-input" 
                      style={{ width: "100%", padding: 8 }}
                      required
                      value={simulateFormData.required_start}
                      onChange={e => setSimulateFormData({...simulateFormData, required_start: e.target.value})}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: 8, fontSize: "var(--text-sm)" }}>Required End</label>
                    <input 
                      type="datetime-local" 
                      className="form-input" 
                      style={{ width: "100%", padding: 8 }}
                      required
                      value={simulateFormData.required_end}
                      onChange={e => setSimulateFormData({...simulateFormData, required_end: e.target.value})}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)" }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsSimulateModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={simulateLoading}>
                    {simulateLoading ? "Checking..." : "Run Feasibility Check"}
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div style={{ padding: "var(--space-4)", borderRadius: "var(--radius-md)", background: feasibilityResult.overall_feasible ? "var(--color-status-success-bg)" : "var(--color-status-danger-bg)", color: feasibilityResult.overall_feasible ? "var(--color-status-success)" : "var(--color-status-danger)", marginBottom: "var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-3)", fontWeight: 600, fontSize: "var(--text-lg)" }}>
                  {feasibilityResult.overall_feasible ? <CheckCircle /> : <XCircle />}
                  {feasibilityResult.overall_feasible ? "FEASIBLE" : "NOT FEASIBLE"}
                </div>
                
                <div style={{ fontSize: "var(--text-sm)", lineHeight: 1.6, marginBottom: "var(--space-4)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--color-border)" }}>
                    <span style={{ color: "var(--color-text-secondary)" }}>Reason:</span>
                    <span style={{ fontWeight: 500, textAlign: "right", maxWidth: "70%" }}>{feasibilityResult.reason}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--color-border)" }}>
                    <span style={{ color: "var(--color-text-secondary)" }}>Machine:</span>
                    <span style={{ fontWeight: 600, color: feasibilityResult.machine_feasible ? "var(--color-status-success)" : "var(--color-status-danger)" }}>
                      {feasibilityResult.machine_feasible ? "✓ OK" : "✗ FAILED"}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--color-border)" }}>
                    <span style={{ color: "var(--color-text-secondary)" }}>Labor:</span>
                    <span style={{ fontWeight: 600, color: feasibilityResult.labor_feasible ? "var(--color-status-success)" : "var(--color-status-danger)" }}>
                      {feasibilityResult.labor_feasible ? "✓ OK" : "✗ FAILED"}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--color-border)" }}>
                    <span style={{ color: "var(--color-text-secondary)" }}>Tool:</span>
                    <span style={{ fontWeight: 600, color: feasibilityResult.tool_feasible ? "var(--color-status-success)" : "var(--color-status-danger)" }}>
                      {feasibilityResult.tool_feasible ? "✓ OK" : "✗ FAILED"}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--color-border)" }}>
                    <span style={{ color: "var(--color-text-secondary)" }}>Date:</span>
                    <span style={{ fontWeight: 600, color: feasibilityResult.date_feasible ? "var(--color-status-success)" : "var(--color-status-danger)" }}>
                      {feasibilityResult.date_feasible ? "✓ OK" : "✗ FAILED"}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--color-border)" }}>
                    <span style={{ color: "var(--color-text-secondary)" }}>Req Machine Hrs:</span>
                    <span style={{ fontWeight: 500 }}>{feasibilityResult.required_machine_hours}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                    <span style={{ color: "var(--color-text-secondary)" }}>Available Machine Hrs:</span>
                    <span style={{ fontWeight: 500 }}>{feasibilityResult.available_machine_hours}</span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button className="btn btn-primary" onClick={() => setIsSimulateModalOpen(false)}>Done</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CapacityPlanning
