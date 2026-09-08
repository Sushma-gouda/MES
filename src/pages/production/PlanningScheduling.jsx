import { useState, useEffect } from "react"
import { Filter, Calendar, ChevronLeft, ChevronRight, Plus, X } from "lucide-react"
import "../../styles/pages.css"
import "../../styles/components.css"

function PlanningScheduling() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [workCenters, setWorkCenters] = useState([])
  const [schedules, setSchedules] = useState([])
  const [orders, setOrders] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createFormData, setCreateFormData] = useState({
    production_order_id: '',
    work_center_id: '',
    sequence_number: 1,
    planned_start: '',
    planned_end: '',
    notes: ''
  })

  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [isEditingSchedule, setIsEditingSchedule] = useState(false)
  const [editFormData, setEditFormData] = useState({})

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterWcId, setFilterWcId] = useState('')

  // Generate hours for timeline
  const hours = Array.from({ length: 12 }, (_, i) => i + 6) // 06:00 to 17:00

  const statusColors = {
    RUNNING: "var(--color-status-success)",
    DISPATCHED: "var(--color-status-success)",
    DELAYED: "var(--color-status-danger)",
    PLANNED: "var(--color-brand-primary)",
    COMPLETED: "var(--color-text-secondary)",
  }

  const toLocalDatetime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const pad = (n) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
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
      const [wcRes, schedRes, ordersRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/production-schedules/work-centers", { headers }),
        fetch("http://127.0.0.1:8000/production-schedules/", { headers }),
        fetch("http://127.0.0.1:8000/production-orders/", { headers })
      ])

      if (!wcRes.ok || !schedRes.ok || !ordersRes.ok) {
        throw new Error("Failed to fetch data from backend.")
      }

      const wcData = await wcRes.json()
      const schedData = await schedRes.json()
      const ordersData = await ordersRes.json()

      setWorkCenters(wcData)
      setSchedules(schedData)
      setOrders(ordersData)
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

  const handlePrevDay = () => {
    const prev = new Date(currentDate)
    prev.setDate(prev.getDate() - 1)
    setCurrentDate(prev)
  }

  const handleNextDay = () => {
    const next = new Date(currentDate)
    next.setDate(next.getDate() + 1)
    setCurrentDate(next)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleCreateSchedule = async (e) => {
    e.preventDefault()

    if (parseInt(createFormData.sequence_number) <= 0) {
      alert("Sequence number must be positive");
      return;
    }
    
    const startDate = new Date(createFormData.planned_start);
    const endDate = new Date(createFormData.planned_end);
    if (endDate <= startDate) {
      alert("Planned end must be after planned start");
      return;
    }

    const token = localStorage.getItem("access_token")
    try {
      const res = await fetch("http://127.0.0.1:8000/production-schedules/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          production_order_id: parseInt(createFormData.production_order_id),
          work_center_id: parseInt(createFormData.work_center_id),
          sequence_number: parseInt(createFormData.sequence_number),
          planned_start: startDate.toISOString(),
          planned_end: endDate.toISOString(),
          notes: createFormData.notes || null
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.detail || "Failed to create schedule")
      }

      setIsCreateModalOpen(false)
      fetchAllData()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleUpdateSchedule = async (e) => {
    e.preventDefault()

    if (parseInt(editFormData.sequence_number) <= 0) {
      alert("Sequence number must be positive");
      return;
    }
    
    const startDate = new Date(editFormData.planned_start);
    const endDate = new Date(editFormData.planned_end);
    if (endDate <= startDate) {
      alert("Planned end must be after planned start");
      return;
    }

    const token = localStorage.getItem("access_token")
    try {
      const res = await fetch(`http://127.0.0.1:8000/production-schedules/${selectedSchedule.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          production_order_id: selectedSchedule.production_order_id,
          work_center_id: parseInt(editFormData.work_center_id),
          sequence_number: parseInt(editFormData.sequence_number),
          planned_start: startDate.toISOString(),
          planned_end: endDate.toISOString(),
          notes: editFormData.notes || null
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.detail || "Failed to update schedule")
      }

      setIsEditingSchedule(false)
      setSelectedSchedule(null)
      fetchAllData()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDispatch = async (scheduleId) => {
    const token = localStorage.getItem("access_token")
    try {
      const res = await fetch(`http://127.0.0.1:8000/production-schedules/${scheduleId}/dispatch`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.detail || "Failed to dispatch schedule")
      }

      setSelectedSchedule(null)
      fetchAllData()
    } catch (err) {
      alert(err.message)
    }
  }

  const openScheduleDetails = (job) => {
    setSelectedSchedule(job);
    setIsEditingSchedule(false);
    setEditFormData({
      work_center_id: job.work_center_id,
      sequence_number: job.sequence_number,
      planned_start: toLocalDatetime(job.planned_start),
      planned_end: toLocalDatetime(job.planned_end),
      notes: job.notes || ''
    });
  }

  const getTimelineStyle = (startStr, endStr, status) => {
    const jobStart = new Date(startStr);
    const jobEnd = new Date(endStr);

    // Timeline window: currentDate from 06:00 to 18:00
    const timelineStart = new Date(currentDate);
    timelineStart.setHours(6, 0, 0, 0);
    const timelineEnd = new Date(currentDate);
    timelineEnd.setHours(18, 0, 0, 0);

    // Check if job falls within the timeline window AT ALL
    if (jobEnd <= timelineStart || jobStart >= timelineEnd) {
      return { display: 'none' };
    }

    // Clamp job start and end to the timeline window
    const renderStart = jobStart < timelineStart ? timelineStart : jobStart;
    const renderEnd = jobEnd > timelineEnd ? timelineEnd : jobEnd;

    const totalMs = timelineEnd.getTime() - timelineStart.getTime();
    const startMs = renderStart.getTime() - timelineStart.getTime();
    const durationMs = renderEnd.getTime() - renderStart.getTime();

    const leftPct = (startMs / totalMs) * 100;
    const widthPct = (durationMs / totalMs) * 100;

    return {
      left: `${leftPct}%`,
      width: `${widthPct}%`,
      background: statusColors[status] || "var(--color-brand-primary)",
      border: status === "DELAYED" ? "1px solid #7f1d1d" : "none",
    }
  }

  const releasedOrders = orders.filter(o => o.status === "RELEASED")
  const visibleWorkCenters = filterWcId ? workCenters.filter(wc => wc.id === parseInt(filterWcId)) : workCenters

  if (loading) {
    return <div className="page-container"><p>Loading scheduling data...</p></div>
  }

  if (error) {
    return <div className="page-container"><p style={{ color: "red" }}>Error: {error}</p></div>
  }

  const formattedDate = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-eyebrow">Plan & Release</div>
          <h1 className="page-header-title">Planning & Scheduling</h1>
          <p className="page-header-subtitle">Visualize and adjust production schedules.</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={16} style={{ marginRight: 8 }} /> Create Schedule
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card" style={{ padding: "var(--space-3) var(--space-4)", marginBottom: "var(--space-6)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-4)" }}>
        <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", background: "var(--color-bg-muted)", padding: "4px 8px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
            <button className="btn btn-icon" style={{ padding: 4 }} onClick={handlePrevDay}><ChevronLeft size={16} /></button>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--text-sm)", fontWeight: 500, minWidth: 140, justifyContent: "center" }}>
              <Calendar size={14} /> {formattedDate}
            </div>
            <button className="btn btn-icon" style={{ padding: 4 }} onClick={handleNextDay}><ChevronRight size={16} /></button>
          </div>
          <button className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "var(--text-sm)" }} onClick={handleToday}>Today</button>
        </div>

        <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 16, fontSize: "var(--text-xs)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 2, background: statusColors.RUNNING }} /> Running/Dispatched</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 2, background: statusColors.PLANNED }} /> Planned</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 2, background: statusColors.DELAYED }} /> Delayed</div>
          </div>
          <div style={{ width: 1, height: 24, background: "var(--color-border)" }} />
          <div style={{ position: 'relative' }}>
            <button className={`btn ${isFilterOpen ? 'btn-primary' : 'btn-secondary'} btn-icon`} title="Filter" onClick={() => setIsFilterOpen(!isFilterOpen)}>
              <Filter size={16} />
            </button>
            {isFilterOpen && (
              <div className="card" style={{ position: 'absolute', right: 0, top: 44, padding: "var(--space-4)", zIndex: 10, width: 250, boxShadow: "var(--shadow-md)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                  <label style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>Filter by Workcenter</label>
                  <X size={14} style={{ cursor: 'pointer', color: 'var(--color-text-muted)' }} onClick={() => setIsFilterOpen(false)} />
                </div>
                <select className="form-input" style={{ width: "100%", padding: "6px" }} value={filterWcId} onChange={e => setFilterWcId(e.target.value)}>
                  <option value="">All Workcenters</option>
                  {workCenters.map(wc => <option key={wc.id} value={wc.id}>{wc.code} - {wc.name}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gantt / Schedule View */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ display: "flex", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-muted)", padding: "var(--space-3) 0" }}>
          <div style={{ width: 180, flexShrink: 0, paddingLeft: "var(--space-4)", fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
            Workcenter
          </div>
          <div style={{ flex: 1, display: "flex", position: "relative" }}>
            {hours.map(hour => (
              <div key={hour} style={{ flex: 1, textAlign: "center", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontWeight: 500, position: "relative" }}>
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {visibleWorkCenters.map(wc => {
            const wcJobs = schedules.filter(s => s.work_center_id === wc.id)
            return (
              <div key={wc.id} style={{ display: "flex", borderBottom: "1px solid var(--color-border-strong)", minHeight: 64, position: "relative" }}>
                {/* Workcenter Label */}
                <div style={{ width: 180, flexShrink: 0, padding: "var(--space-3) var(--space-4)", display: "flex", alignItems: "center", borderRight: "1px solid var(--color-border)", background: "var(--color-bg-surface)", zIndex: 2 }}>
                  <span className="chip" style={{ fontWeight: 600 }} title={wc.name}>{wc.code}</span>
                </div>

                {/* Timeline Grid (Background) */}
                <div style={{ flex: 1, display: "flex", position: "relative", background: "var(--color-bg-surface)" }}>
                  {hours.map(hour => (
                    <div key={hour} style={{ flex: 1, borderRight: "1px dashed var(--color-border)", opacity: 0.5 }} />
                  ))}

                  {/* Job Blocks */}
                  {wcJobs.map(job => {
                    const style = getTimelineStyle(job.planned_start, job.planned_end, job.status)
                    if (style.display === 'none') return null;

                    return (
                      <div
                        key={job.id}
                        style={{
                          position: "absolute",
                          top: "50%",
                          transform: "translateY(-50%)",
                          height: 40,
                          borderRadius: "var(--radius-sm)",
                          padding: "4px 8px",
                          color: "white",
                          fontSize: "var(--text-xs)",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          overflow: "hidden",
                          boxShadow: "var(--shadow-sm)",
                          cursor: "pointer",
                          opacity: 0.95,
                          ...style
                        }}
                        title={`${job.order_number} - ${job.product_name}`}
                        onClick={() => openScheduleDetails(job)}
                      >
                        <div style={{ fontWeight: 700, whiteSpace: "nowrap" }}>{job.order_number}</div>
                        <div style={{ opacity: 0.9, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{job.product_name}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
          {visibleWorkCenters.length === 0 && (
            <div style={{ padding: "var(--space-6)", textAlign: "center", color: "var(--color-text-secondary)" }}>
              No work centers found.
            </div>
          )}
        </div>
      </div>

      {/* Unscheduled Orders Panel */}
      <div className="card" style={{ marginTop: "var(--space-6)" }}>
        <div className="card-header">
          <div className="card-title">Released Orders (Ready for Scheduling)</div>
        </div>
        <div className="card-body" style={{ padding: "var(--space-4)" }}>
          <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
            {releasedOrders.map(order => (
              <div key={order.id} style={{ border: "1px dashed var(--color-border-strong)", borderRadius: "var(--radius-md)", padding: "var(--space-3)", width: 220, background: "var(--color-bg-muted)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span className="order-number" style={{ fontSize: "var(--text-sm)" }}>{order.order_number}</span>
                  <span className={`badge ${order.priority === 'HIGH' || order.priority === 'CRITICAL' ? 'priority-high' : 'badge-neutral'}`} style={{ fontSize: 10 }}>{order.priority}</span>
                </div>
                <div style={{ fontSize: "var(--text-xs)", fontWeight: 500, marginBottom: 8 }} className="truncate">{order.product_name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "var(--color-text-secondary)" }}>
                  <span>{order.quantity} units</span>
                  <span>Rem: {order.remaining_quantity}</span>
                </div>
              </div>
            ))}
            {releasedOrders.length === 0 && (
              <div style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>No released orders available.</div>
            )}
          </div>
        </div>
      </div>

      {/* Create Schedule Modal */}
      {isCreateModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div className="card" style={{ width: 500, padding: "var(--space-6)", maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
              <h3 style={{ margin: 0 }}>Create Schedule</h3>
              <button className="btn btn-icon" onClick={() => setIsCreateModalOpen(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleCreateSchedule}>
              <div style={{ marginBottom: "var(--space-4)" }}>
                <label style={{ display: "block", marginBottom: 8, fontSize: "var(--text-sm)" }}>Production Order</label>
                <select
                  className="form-input"
                  style={{ width: "100%", padding: 8 }}
                  required
                  value={createFormData.production_order_id}
                  onChange={e => setCreateFormData({ ...createFormData, production_order_id: e.target.value })}
                >
                  <option value="">Select a released order...</option>
                  {releasedOrders.map(o => (
                    <option key={o.id} value={o.id}>{o.order_number} - {o.product_name}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "var(--space-4)" }}>
                <label style={{ display: "block", marginBottom: 8, fontSize: "var(--text-sm)" }}>Work Center</label>
                <select
                  className="form-input"
                  style={{ width: "100%", padding: 8 }}
                  required
                  value={createFormData.work_center_id}
                  onChange={e => setCreateFormData({ ...createFormData, work_center_id: e.target.value })}
                >
                  <option value="">Select a work center...</option>
                  {workCenters.map(wc => (
                    <option key={wc.id} value={wc.id}>{wc.code} - {wc.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "var(--space-4)", display: "flex", gap: "var(--space-4)" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: 8, fontSize: "var(--text-sm)" }}>Planned Start</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    style={{ width: "100%", padding: 8 }}
                    required
                    value={createFormData.planned_start}
                    onChange={e => setCreateFormData({ ...createFormData, planned_start: e.target.value })}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: 8, fontSize: "var(--text-sm)" }}>Planned End</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    style={{ width: "100%", padding: 8 }}
                    required
                    value={createFormData.planned_end}
                    onChange={e => setCreateFormData({ ...createFormData, planned_end: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "var(--space-4)" }}>
                <label style={{ display: "block", marginBottom: 8, fontSize: "var(--text-sm)" }}>Sequence Number</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  style={{ width: "100%", padding: 8 }}
                  required
                  value={createFormData.sequence_number}
                  onChange={e => setCreateFormData({ ...createFormData, sequence_number: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: "var(--space-6)" }}>
                <label style={{ display: "block", marginBottom: 8, fontSize: "var(--text-sm)" }}>Notes</label>
                <textarea
                  className="form-input"
                  style={{ width: "100%", padding: 8, minHeight: 60 }}
                  value={createFormData.notes}
                  onChange={e => setCreateFormData({ ...createFormData, notes: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Details / Dispatch / Edit Modal */}
      {selectedSchedule && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div className="card" style={{ width: 450, padding: "var(--space-6)", maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
              <h3 style={{ margin: 0 }}>
                {isEditingSchedule ? "Edit Schedule" : "Schedule Details"}
              </h3>
              <button className="btn btn-icon" onClick={() => setSelectedSchedule(null)}><X size={16} /></button>
            </div>

            {!isEditingSchedule ? (
              <>
                <div style={{ marginBottom: "var(--space-6)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>
                  <p><strong>Order:</strong> {selectedSchedule.order_number}</p>
                  <p><strong>Product:</strong> {selectedSchedule.product_name}</p>
                  <p><strong>Status:</strong> <span style={{ color: statusColors[selectedSchedule.status] || "inherit", fontWeight: "bold" }}>{selectedSchedule.status}</span></p>
                  <p><strong>Work Center:</strong> {selectedSchedule.work_center_name}</p>
                  <p><strong>Sequence:</strong> {selectedSchedule.sequence_number}</p>
                  <p><strong>Start:</strong> {new Date(selectedSchedule.planned_start).toLocaleString()}</p>
                  <p><strong>End:</strong> {new Date(selectedSchedule.planned_end).toLocaleString()}</p>
                  {selectedSchedule.notes && <p><strong>Notes:</strong> {selectedSchedule.notes}</p>}
                </div>

                {selectedSchedule.status === "PLANNED" && (
                  <div style={{ display: "flex", gap: "var(--space-3)" }}>
                    <button
                      className="btn btn-secondary"
                      style={{ flex: 1 }}
                      onClick={() => setIsEditingSchedule(true)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                      onClick={() => handleDispatch(selectedSchedule.id)}
                    >
                      Dispatch
                    </button>
                  </div>
                )}
              </>
            ) : (
              <form onSubmit={handleUpdateSchedule}>
                <div style={{ marginBottom: "var(--space-4)" }}>
                  <label style={{ display: "block", marginBottom: 8, fontSize: "var(--text-sm)" }}>Work Center</label>
                  <select
                    className="form-input"
                    style={{ width: "100%", padding: 8 }}
                    required
                    value={editFormData.work_center_id}
                    onChange={e => setEditFormData({ ...editFormData, work_center_id: e.target.value })}
                  >
                    {workCenters.map(wc => (
                      <option key={wc.id} value={wc.id}>{wc.code} - {wc.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: "var(--space-4)", display: "flex", gap: "var(--space-4)" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: 8, fontSize: "var(--text-sm)" }}>Planned Start</label>
                    <input
                      type="datetime-local"
                      className="form-input"
                      style={{ width: "100%", padding: 8 }}
                      required
                      value={editFormData.planned_start}
                      onChange={e => setEditFormData({ ...editFormData, planned_start: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: 8, fontSize: "var(--text-sm)" }}>Planned End</label>
                    <input
                      type="datetime-local"
                      className="form-input"
                      style={{ width: "100%", padding: 8 }}
                      required
                      value={editFormData.planned_end}
                      onChange={e => setEditFormData({ ...editFormData, planned_end: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "var(--space-4)" }}>
                  <label style={{ display: "block", marginBottom: 8, fontSize: "var(--text-sm)" }}>Sequence Number</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    style={{ width: "100%", padding: 8 }}
                    required
                    value={editFormData.sequence_number}
                    onChange={e => setEditFormData({ ...editFormData, sequence_number: e.target.value })}
                  />
                </div>

                <div style={{ marginBottom: "var(--space-6)" }}>
                  <label style={{ display: "block", marginBottom: 8, fontSize: "var(--text-sm)" }}>Notes</label>
                  <textarea
                    className="form-input"
                    style={{ width: "100%", padding: 8, minHeight: 60 }}
                    value={editFormData.notes}
                    onChange={e => setEditFormData({ ...editFormData, notes: e.target.value })}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)" }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsEditingSchedule(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PlanningScheduling

