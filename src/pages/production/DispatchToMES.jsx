import { useState, useEffect } from "react"
import { Play, CheckCircle, Clock } from "lucide-react"
import "../../styles/pages.css"
import "../../styles/components.css"

function DispatchToMES() {
  const [eligibleSchedules, setEligibleSchedules] = useState([])
  const [dispatchQueue, setDispatchQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dispatchingId, setDispatchingId] = useState(null)

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
      const [eligibleRes, queueRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/dispatch-mes/eligible", { headers }),
        fetch("http://127.0.0.1:8000/dispatch-mes/queue", { headers })
      ])

      if (!eligibleRes.ok || !queueRes.ok) {
        throw new Error("Failed to fetch dispatch data from backend.")
      }

      const eligibleData = await eligibleRes.json()
      const queueData = await queueRes.json()

      setEligibleSchedules(eligibleData)
      setDispatchQueue(queueData)
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

  const handleDispatch = async (scheduleId) => {
    setDispatchingId(scheduleId)
    const token = localStorage.getItem("access_token")
    const headers = {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/dispatch-mes/dispatch/${scheduleId}`, {
        method: "POST",
        headers
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(getErrorMessage(errData, "Failed to dispatch to MES"))
      }

      await fetchAllData()
    } catch (err) {
      alert(err.message)
    } finally {
      setDispatchingId(null)
    }
  }

  if (loading) {
    return <div className="page-container"><p>Loading dispatch data...</p></div>
  }

  if (error) {
    return <div className="page-container"><p style={{ color: "red" }}>Error: {error}</p></div>
  }

  const pendingEligible = eligibleSchedules.filter(s => !s.is_dispatched && s.feasibility_status === "FEASIBLE")

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-eyebrow">Plan & Release</div>
          <h1 className="page-header-title">Dispatch to MES</h1>
          <p className="page-header-subtitle">Push finalized and feasible schedules into the active execution queue.</p>
        </div>
      </div>

      {/* Main Content: Pending Eligible */}
      <div className="card" style={{ marginBottom: "var(--space-6)" }}>
        <div className="card-header">
          <div className="card-title">Eligible for Dispatch</div>
          <div className="card-subtitle">Orders that have passed capacity planning and feasibility checks</div>
        </div>
        
        <div className="table-wrapper" style={{ border: "none", borderRadius: 0, boxShadow: "none" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Priority</th>
                <th>Work Center</th>
                <th>Start Date</th>
                <th>Feasibility</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingEligible.map(schedule => {
                const isHighPriority = schedule.priority.toUpperCase() === "HIGH"
                
                return (
                  <tr key={schedule.production_schedule_id}>
                    <td><span className="chip" style={{ fontWeight: 600 }}>{schedule.order_number}</span></td>
                    <td>{schedule.product_name}</td>
                    <td>{schedule.quantity}</td>
                    <td>
                      <span className={`badge ${isHighPriority ? 'badge-danger' : 'badge-neutral'}`}>
                        {schedule.priority}
                      </span>
                    </td>
                    <td><span className="chip">{schedule.work_center_code}</span></td>
                    <td>{new Date(schedule.planned_start).toLocaleString()}</td>
                    <td>
                      <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle size={12} /> {schedule.feasibility_status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button 
                        className="btn btn-primary" 
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px' }}
                        onClick={() => handleDispatch(schedule.production_schedule_id)}
                        disabled={dispatchingId === schedule.production_schedule_id}
                      >
                        <Play size={14} />
                        {dispatchingId === schedule.production_schedule_id ? "Dispatching..." : "Dispatch"}
                      </button>
                    </td>
                  </tr>
                )
              })}
              {pendingEligible.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "var(--space-6)", color: "var(--color-text-secondary)" }}>
                    No eligible schedules pending dispatch. Run feasibility checks first.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispatched Queue */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Active MES Queue</div>
          <div className="card-subtitle">Orders successfully handed over to execution</div>
        </div>
        
        <div className="table-wrapper" style={{ border: "none", borderRadius: 0, boxShadow: "none" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Queue ID</th>
                <th>Schedule ID</th>
                <th>Order ID</th>
                <th>Status</th>
                <th>Dispatched At</th>
                <th>Dispatched By</th>
              </tr>
            </thead>
            <tbody>
              {dispatchQueue.map(item => (
                <tr key={item.id}>
                  <td>#{item.id}</td>
                  <td>{item.production_schedule_id}</td>
                  <td>{item.production_order_id}</td>
                  <td>
                    <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} /> {item.status}
                    </span>
                  </td>
                  <td>{new Date(item.dispatched_at).toLocaleString()}</td>
                  <td>{item.dispatched_by}</td>
                </tr>
              ))}
              {dispatchQueue.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "var(--space-6)", color: "var(--color-text-secondary)" }}>
                    The dispatch queue is currently empty.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DispatchToMES
