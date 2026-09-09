import { useEffect, useState } from "react"
import { Search, Filter, Download, Plus, MoreHorizontal, RefreshCw, X, AlertCircle } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import "../../styles/pages.css"
import "../../styles/components.css"

function StatusBadge({ status }) {
  const map = {
    RECEIVED: "neutral",
    READY: "blue",
    RELEASED: "blue",
    ON_HOLD: "warning",
    CANCELLED: "neutral",
    COMPLETED: "success",
    IN_PROGRESS: "info",
  }

  const displayStatus = {
    RECEIVED: "Received",
    READY: "Ready",
    RELEASED: "Released",
    ON_HOLD: "On Hold",
    CANCELLED: "Cancelled",
    COMPLETED: "Completed",
    IN_PROGRESS: "In Progress",
  }

  const variant = map[status] || "neutral"
  const label = displayStatus[status] || status

  return (
    <span className={`badge badge-${variant}`}>
      <span className="badge-dot" />
      {label}
    </span>
  )
}

function PriorityBadge({ priority }) {
  const priorityClass = {
    CRITICAL: "priority-critical",
    HIGH: "priority-high",
    MEDIUM: "priority-medium",
    LOW: "priority-low",
  }

  return (
    <span className={`badge ${priorityClass[priority] || "badge-neutral"}`}>
      {priority}
    </span>
  )
}

function ProductionOrders() {
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const [formData, setFormData] = useState({
    order_number: "",
    erp_order_number: "",
    customer_id: "",
    product_id: "",
    quantity: "",
    due_date: "",
    priority: "MEDIUM",
    bom_revision: "",
    routing_revision: "",
  })

  // Actions Menu State
  const [activeDropdownId, setActiveDropdownId] = useState(null)

  // Hold Modal State
  const [holdModalOpen, setHoldModalOpen] = useState(false)
  const [holdReason, setHoldReason] = useState("")
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Details Modal State
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [orderDetails, setOrderDetails] = useState(null)

  const fetchProductionOrders = async () => {
    try {
      setLoading(true)
      setError("")

      const token = localStorage.getItem("access_token")

      if (!token) {
        setError("You are not logged in.")
        return
      }

      const response = await fetch("http://127.0.0.1:8000/production-orders/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store"
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to load production orders")
      }

      const data = await response.json()
      setOrders(data)
    } catch (err) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProductionOrders()
  }, [])

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setActiveDropdownId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const fetchReferenceData = async () => {
    try {
      const token = localStorage.getItem("access_token")
      const headers = { Authorization: `Bearer ${token}` }

      const [resCust, resProd] = await Promise.all([
        fetch("http://127.0.0.1:8000/customers/", { headers }),
        fetch("http://127.0.0.1:8000/products/", { headers }),
      ])

      if (resCust.ok) setCustomers(await resCust.json())
      if (resProd.ok) setProducts(await resProd.json())
    } catch (err) {
      console.error("Failed to load reference data", err)
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
    setFormError("")
    setFormData({
      order_number: "",
      erp_order_number: "",
      customer_id: "",
      product_id: "",
      quantity: "",
      due_date: "",
      priority: "MEDIUM",
      bom_revision: "",
      routing_revision: "",
    })
    fetchReferenceData()
  }

  const handleCreateOrder = async (e) => {
    e.preventDefault()
    setFormError("")

    if (formData.quantity <= 0) {
      setFormError("Quantity must be greater than 0.")
      return
    }

    try {
      setFormLoading(true)
      const token = localStorage.getItem("access_token")

      const payload = {
        ...formData,
        customer_id: parseInt(formData.customer_id),
        product_id: parseInt(formData.product_id),
        quantity: parseInt(formData.quantity),
        due_date: new Date(formData.due_date).toISOString()
      }

      const response = await fetch("http://127.0.0.1:8000/production-orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to create order")
      }

      setIsModalOpen(false)
      showSuccessMessage("Order created successfully!")
      fetchProductionOrders()
    } catch (err) {
      setFormError(err.message || "Failed to create order")
    } finally {
      setFormLoading(false)
    }
  }

  const showSuccessMessage = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(""), 3000)
  }

  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase()

    const matchesSearch =
      order.order_number.toLowerCase().includes(search) ||
      order.erp_order_number.toLowerCase().includes(search) ||
      order.product_name.toLowerCase().includes(search) ||
      order.product_code.toLowerCase().includes(search) ||
      order.customer_name.toLowerCase().includes(search)

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const exportPDF = () => {
    if (filteredOrders.length === 0) return

    const doc = new jsPDF("landscape")

    // Theme Colors
    const primaryColor = [15, 23, 42]
    const accentColor = [37, 99, 235]

    // Add Title
    doc.setFontSize(20)
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text("MES", 14, 22)

    doc.setFontSize(14)
    doc.setTextColor(100, 100, 100)
    doc.text("Production Orders Report", 14, 30)

    // Add Date
    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 38)

    const tableColumn = ["Order No", "ERP No", "Product", "Customer", "Status", "Qty", "Done", "Priority", "Due Date"]

    const tableRows = []

    filteredOrders.forEach(order => {
      const orderData = [
        order.order_number,
        order.erp_order_number,
        order.product_name,
        order.customer_name,
        order.status,
        order.quantity,
        order.produced_quantity,
        order.priority,
        new Date(order.due_date).toLocaleDateString()
      ]
      tableRows.push(orderData)
    })

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: accentColor, textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] }
    })

    const dateStr = new Date().toISOString().split('T')[0]
    doc.save(`Production-Orders-${dateStr}.pdf`)
    showSuccessMessage("PDF Exported successfully!")
  }

  const handleActionClick = (id) => {
    setActiveDropdownId(activeDropdownId === id ? null : id)
  }

  const performAction = async (id, action) => {
    try {
      setActionLoading(true)
      const token = localStorage.getItem("access_token")
      const response = await fetch(`http://127.0.0.1:8000/production-orders/${id}/${action}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `Failed to ${action} order`)
      }
      showSuccessMessage(`Order ${action}d successfully!`)
      fetchProductionOrders()
    } catch (err) {
      setError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleValidate = async (id) => {
    setActiveDropdownId(null)
    await performAction(id, "validate")
  }

  const handleRelease = async (id) => {
    setActiveDropdownId(null)
    await performAction(id, "release")
  }

  const handleOpenHold = (id) => {
    setActiveDropdownId(null)
    setSelectedOrderId(id)
    setHoldReason("")
    setHoldModalOpen(true)
  }

  const handleSubmitHold = async (e) => {
    e.preventDefault()
    if (!holdReason.trim()) return

    try {
      setActionLoading(true)
      const token = localStorage.getItem("access_token")
      const response = await fetch(`http://127.0.0.1:8000/production-orders/${selectedOrderId}/hold`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ hold_reason: holdReason }),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to put order on hold")
      }
      setHoldModalOpen(false)
      showSuccessMessage("Order put on hold successfully!")
      fetchProductionOrders()
    } catch (err) {
      setError(err.message)
      setHoldModalOpen(false)
    } finally {
      setActionLoading(false)
    }
  }

  const handleViewDetails = async (id) => {
    setActiveDropdownId(null)
    try {
      setActionLoading(true)
      const token = localStorage.getItem("access_token")
      const response = await fetch(`http://127.0.0.1:8000/production-orders/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to fetch order details")
      }
      const data = await response.json()
      setOrderDetails(data)
      setDetailsModalOpen(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const total = orders.length
  const active = orders.filter(
    (order) =>
      order.status === "RECEIVED" ||
      order.status === "READY" ||
      order.status === "RELEASED" ||
      order.status === "IN_PROGRESS"
  ).length
  const completed = orders.filter((order) => order.status === "COMPLETED").length
  const onHold = orders.filter((order) => order.status === "ON_HOLD").length

  return (
    <div className="page-container" style={{ position: "relative" }}>

      {successMsg && (
        <div style={{ position: "fixed", top: 24, right: 24, background: "var(--color-status-success)", color: "white", padding: "12px 24px", borderRadius: "var(--radius-md)", fontWeight: 600, zIndex: 9999, boxShadow: "var(--shadow-lg)" }}>
          {successMsg}
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-eyebrow">Plan & Release</div>
          <h1 className="page-header-title">Production Orders</h1>
          <p className="page-header-subtitle">Manage and track all manufacturing orders.</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-primary" onClick={handleOpenModal}>
            <Plus size={16} />
            New Order
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="dashboard-kpi-row" style={{ marginBottom: "var(--space-6)" }}>
        <div className="card" style={{ padding: "var(--space-4)" }}>
          <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", fontWeight: 500 }}>Total Orders</div>
          <div style={{ fontSize: "var(--text-3xl)", fontWeight: 700, marginTop: "var(--space-2)" }}>{total}</div>
        </div>
        <div className="card" style={{ padding: "var(--space-4)" }}>
          <div style={{ color: "var(--color-status-info)", fontSize: "var(--text-sm)", fontWeight: 500 }}>Active</div>
          <div style={{ fontSize: "var(--text-3xl)", fontWeight: 700, marginTop: "var(--space-2)" }}>{active}</div>
        </div>
        <div className="card" style={{ padding: "var(--space-4)" }}>
          <div style={{ color: "var(--color-status-success)", fontSize: "var(--text-sm)", fontWeight: 500 }}>Completed</div>
          <div style={{ fontSize: "var(--text-3xl)", fontWeight: 700, marginTop: "var(--space-2)" }}>{completed}</div>
        </div>
        <div className="card" style={{ padding: "var(--space-4)" }}>
          <div style={{ color: "var(--color-status-warning)", fontSize: "var(--text-sm)", fontWeight: 500 }}>On Hold</div>
          <div style={{ fontSize: "var(--text-3xl)", fontWeight: 700, marginTop: "var(--space-2)" }}>{onHold}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card" style={{ padding: "var(--space-6)", marginBottom: "var(--space-6)", display: "flex", gap: "var(--space-4)", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", background: "var(--color-bg-primary)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ display: "flex", gap: "var(--space-4)", flex: 1, minWidth: 300, alignItems: "center" }}>
          <div className="search-input-container" style={{ flex: 1, maxWidth: 500, position: "relative" }}>
            <Search className="search-icon" size={20} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
            <input
              type="text"
              className="form-input search-input"
              style={{ padding: "12px 16px 12px 48px", fontSize: "16px", borderRadius: "var(--radius-full)", border: "1px solid var(--color-border)", width: "100%", background: "var(--color-bg-muted)", transition: "all 0.2s ease" }}
              placeholder="Search by order, product, or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ position: "relative", minWidth: "180px" }}>
            <select
              className="form-input"
              style={{ padding: "12px 16px 12px 42px", fontSize: "15px", borderRadius: "var(--radius-full)", border: "1px solid var(--color-border)", appearance: "none", width: "100%", background: "white", cursor: "pointer", fontWeight: 500, color: "var(--color-text-secondary)" }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="RECEIVED">Received</option>
              <option value="READY">Ready</option>
              <option value="RELEASED">Released</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <Filter size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)", pointerEvents: "none" }} />
          </div>
          <button className="btn btn-secondary btn-icon" style={{ borderRadius: "50%", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={fetchProductionOrders} title="Refresh Data" disabled={actionLoading}>
            <RefreshCw size={18} />
          </button>
        </div>
        <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", fontWeight: 500, background: "var(--color-bg-muted)", padding: "8px 16px", borderRadius: "var(--radius-full)" }}>
          Showing {filteredOrders.length} orders
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="card-header" style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-4)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="card-title">Production Orders List</div>
          <button className="btn btn-primary" onClick={exportPDF} disabled={filteredOrders.length === 0} style={{ width: "auto" }}>
            <Download size={16} /> Export PDF
          </button>
        </div>
        <div className="table-wrapper" style={{ border: "none" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Product & Part</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Qty</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Workcenter</th>
                <th style={{ width: 50 }} />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--color-text-muted)" }}>
                    Loading production orders...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: "center", padding: "var(--space-8)" }}>
                    <div style={{ color: "var(--color-status-danger)", marginBottom: 8, fontWeight: 500 }}>{error}</div>
                    <button className="btn btn-secondary" onClick={fetchProductionOrders}>Dismiss & Refresh</button>
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const pct = order.quantity > 0 ? Math.round((order.produced_quantity / order.quantity) * 100) : 0
                  const dueDate = new Date(order.due_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })

                  return (
                    <tr key={order.id}>
                      <td>
                        <div className="order-number">{order.order_number}</div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>ERP: {order.erp_order_number}</div>
                      </td>
                      <td>
                        <div className="table-cell-strong">{order.product_name}</div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{order.product_code}</div>
                      </td>
                      <td style={{ color: "var(--color-text-secondary)" }}>{order.customer_name}</td>
                      <td><StatusBadge status={order.status} /></td>
                      <td style={{ minWidth: 120 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div className="progress-bar-track" style={{ flex: 1 }}>
                            <div className="progress-bar-fill progress-blue" style={{ width: `${pct}%` }} />
                          </div>
                          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", minWidth: 32 }}>{pct}%</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{order.quantity}</div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{order.produced_quantity} done</div>
                      </td>
                      <td><PriorityBadge priority={order.priority} /></td>
                      <td style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>{dueDate}</td>
                      <td><span className="chip">Not assigned</span></td>
                      <td className="dropdown-container">
                        <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                          <button className="btn btn-icon" style={{ padding: 4 }} onClick={() => handleActionClick(order.id)} disabled={actionLoading}>
                            <MoreHorizontal size={16} />
                          </button>
                          {activeDropdownId === order.id && (
                            <div style={{ position: "absolute", right: 0, top: "100%", background: "white", boxShadow: "var(--shadow-md)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", zIndex: 9999, minWidth: "140px", display: "flex", flexDirection: "column", padding: "4px 0", marginTop: "4px" }}>
                              <button style={{ background: "none", border: "none", padding: "8px 16px", textAlign: "left", cursor: "pointer", fontSize: "14px", color: "var(--color-text-primary)", width: "100%" }} onClick={() => handleViewDetails(order.id)} onMouseOver={e => e.currentTarget.style.background = "var(--color-bg-muted)"} onMouseOut={e => e.currentTarget.style.background = "none"}>View Details</button>
                              {order.status === "RECEIVED" && <button style={{ background: "none", border: "none", padding: "8px 16px", textAlign: "left", cursor: "pointer", fontSize: "14px", color: "var(--color-text-primary)", width: "100%" }} onClick={() => handleValidate(order.id)} onMouseOver={e => e.currentTarget.style.background = "var(--color-bg-muted)"} onMouseOut={e => e.currentTarget.style.background = "none"}>Validate</button>}
                              {order.status === "READY" && <button style={{ background: "none", border: "none", padding: "8px 16px", textAlign: "left", cursor: "pointer", fontSize: "14px", color: "var(--color-text-primary)", width: "100%" }} onClick={() => handleRelease(order.id)} onMouseOver={e => e.currentTarget.style.background = "var(--color-bg-muted)"} onMouseOut={e => e.currentTarget.style.background = "none"}>Release</button>}
                              {(order.status === "RECEIVED" || order.status === "READY" || order.status === "RELEASED") && (
                                <button style={{ background: "none", border: "none", padding: "8px 16px", textAlign: "left", cursor: "pointer", fontSize: "14px", color: "var(--color-status-danger)", width: "100%" }} onClick={() => handleOpenHold(order.id)} onMouseOver={e => e.currentTarget.style.background = "var(--color-status-danger-bg)"} onMouseOut={e => e.currentTarget.style.background = "none"}>Put on Hold</button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="10" style={{ textAlign: "center", padding: "var(--space-12)" }}>
                    <Search size={32} style={{ margin: "0 auto 12px", color: "var(--color-text-muted)" }} />
                    <div style={{ color: "var(--color-text-secondary)", fontWeight: 500 }}>No production orders found.</div>
                    <div style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)", marginTop: 4 }}>Try adjusting your search or filters.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Put on Hold Modal */}
      {holdModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(2px)" }}>
          <div className="card" style={{ width: "100%", maxWidth: 400 }}>
            <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-4)" }}>
              <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--color-text-primary)" }}>Put Order on Hold</h2>
              <button className="btn btn-icon" onClick={() => setHoldModalOpen(false)} disabled={actionLoading}>
                <X size={20} />
              </button>
            </div>
            <div className="card-body" style={{ padding: "var(--space-6)" }}>
              <form onSubmit={handleSubmitHold} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <div className="form-group">
                  <label className="form-label">Hold Reason *</label>
                  <textarea required className="form-input" placeholder="e.g. Waiting for material confirmation" value={holdReason} onChange={e => setHoldReason(e.target.value)} rows={3} style={{ resize: "none" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setHoldModalOpen(false)} disabled={actionLoading}>Cancel</button>
                  <button type="submit" className="btn" style={{ background: "var(--color-status-danger)", color: "white", border: "none" }} disabled={actionLoading}>
                    {actionLoading ? "Processing..." : "Put on Hold"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {detailsModalOpen && orderDetails && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(2px)" }}>
          <div className="card" style={{ width: "100%", maxWidth: 700, maxHeight: "90vh", overflowY: "auto" }}>
            <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-4)" }}>
              <div>
                <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--color-text-primary)" }}>Order Details: {orderDetails.order_number}</h2>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>Complete production order information</div>
              </div>
              <button className="btn btn-icon" onClick={() => setDetailsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="card-body" style={{ padding: "var(--space-6)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }}>

                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "12px", borderBottom: "1px solid var(--color-border)", paddingBottom: "4px" }}>General Information</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>Order Number:</span> <strong>{orderDetails.order_number}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>ERP Order No:</span> <strong>{orderDetails.erp_order_number}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--color-text-secondary)" }}>Status:</span> <StatusBadge status={orderDetails.status} /></div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--color-text-secondary)" }}>Priority:</span> <PriorityBadge priority={orderDetails.priority} /></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>Due Date:</span> <strong>{new Date(orderDetails.due_date).toLocaleDateString()}</strong></div>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "12px", borderBottom: "1px solid var(--color-border)", paddingBottom: "4px" }}>Product & Customer</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>Customer:</span> <strong>{orderDetails.customer_name} ({orderDetails.customer_code})</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>Product:</span> <strong>{orderDetails.product_name}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>Product Code:</span> <strong>{orderDetails.product_code}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>Product Revision:</span> <strong>{orderDetails.product_revision || "-"}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>BOM Rev:</span> <strong>{orderDetails.bom_revision}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>Routing Rev:</span> <strong>{orderDetails.routing_revision}</strong></div>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "12px", borderBottom: "1px solid var(--color-border)", paddingBottom: "4px" }}>Quantities</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>Target Quantity:</span> <strong>{orderDetails.quantity}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>Produced:</span> <strong>{orderDetails.produced_quantity}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>Remaining:</span> <strong>{orderDetails.remaining_quantity}</strong></div>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "12px", borderBottom: "1px solid var(--color-border)", paddingBottom: "4px" }}>Timeline</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>Planned Start:</span> <strong>{orderDetails.planned_start ? new Date(orderDetails.planned_start).toLocaleString() : "-"}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>Planned End:</span> <strong>{orderDetails.planned_end ? new Date(orderDetails.planned_end).toLocaleString() : "-"}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>Actual Start:</span> <strong>{orderDetails.actual_start ? new Date(orderDetails.actual_start).toLocaleString() : "-"}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>Actual End:</span> <strong>{orderDetails.actual_end ? new Date(orderDetails.actual_end).toLocaleString() : "-"}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>Released At:</span> <strong>{orderDetails.released_at ? new Date(orderDetails.released_at).toLocaleString() : "-"}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-secondary)" }}>Released By:</span> <strong>{orderDetails.released_by || "-"}</strong></div>
                  </div>
                </div>

              </div>

              {orderDetails.hold_reason && (
                <div style={{ marginTop: "24px", padding: "12px", background: "var(--color-status-warning-bg)", border: "1px solid var(--color-status-warning-border)", borderRadius: "var(--radius-md)" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-status-warning)", marginBottom: "4px" }}>Hold Reason</h3>
                  <p style={{ fontSize: "14px", color: "var(--color-text-primary)", margin: 0 }}>{orderDetails.hold_reason}</p>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--color-border)" }}>
                <button className="btn btn-secondary" onClick={() => setDetailsModalOpen(false)}>Close</button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* New Order Modal */}
      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(2px)" }}>
          <div className="card" style={{ width: "100%", maxWidth: 600, maxHeight: "90vh", overflowY: "auto" }}>
            <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-4)" }}>
              <div>
                <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--color-text-primary)" }}>Create New Production Order</h2>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>Enter the details to schedule a new manufacturing job.</div>
              </div>
              <button className="btn btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="card-body" style={{ padding: "var(--space-6)" }}>

              {formError && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px", background: "var(--color-status-danger-bg)", color: "var(--color-status-danger)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-status-danger-border)", marginBottom: "var(--space-6)" }}>
                  <AlertCircle size={16} />
                  <span style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>{formError}</span>
                </div>
              )}

              <form onSubmit={handleCreateOrder} style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                  <div className="form-group">
                    <label className="form-label">Order Number *</label>
                    <input required type="text" className="form-input" placeholder="e.g. PO-2401" value={formData.order_number} onChange={e => setFormData({ ...formData, order_number: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ERP Order Number *</label>
                    <input required type="text" className="form-input" placeholder="e.g. ERP-99201" value={formData.erp_order_number} onChange={e => setFormData({ ...formData, erp_order_number: e.target.value })} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                  <div className="form-group">
                    <label className="form-label">Customer *</label>
                    <select required className="form-input" value={formData.customer_id} onChange={e => setFormData({ ...formData, customer_id: e.target.value })}>
                      <option value="">Select a customer...</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.customer_name} ({c.customer_code})</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Product *</label>
                    <select required className="form-input" value={formData.product_id} onChange={e => setFormData({ ...formData, product_id: e.target.value })}>
                      <option value="">Select a product...</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.product_name} ({p.product_code})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                  <div className="form-group">
                    <label className="form-label">Quantity *</label>
                    <input required type="number" min="1" className="form-input" placeholder="100" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Due Date *</label>
                    <input required type="datetime-local" className="form-input" value={formData.due_date} onChange={e => setFormData({ ...formData, due_date: e.target.value })} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Priority *</label>
                  <select required className="form-input" value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                  <div className="form-group">
                    <label className="form-label">BOM Revision *</label>
                    <input required type="text" className="form-input" placeholder="e.g. A.1" value={formData.bom_revision} onChange={e => setFormData({ ...formData, bom_revision: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Routing Revision *</label>
                    <input required type="text" className="form-input" placeholder="e.g. R.2" value={formData.routing_revision} onChange={e => setFormData({ ...formData, routing_revision: e.target.value })} />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-4)", borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-4)" }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)} disabled={formLoading}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={formLoading}>
                    {formLoading ? "Creating Order..." : "Create Order"}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default ProductionOrders
