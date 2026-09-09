import { useState, useEffect } from "react"
import { Package, Search, AlertCircle, CheckCircle2, X } from "lucide-react"
import "../../styles/pages.css"
import "../../styles/components.css"

function StagingKitting() {
  const [kits, setKits] = useState([])
  const [kitItems, setKitItems] = useState([])
  const [materials, setMaterials] = useState([])
  const [orders, setOrders] = useState([])
  const [workCenters, setWorkCenters] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [searchTerm, setSearchTerm] = useState("")

  const [selectedKit, setSelectedKit] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState("")

  const fetchData = async () => {
    try {
      setLoading(true)
      setError("")
      const token = localStorage.getItem("access_token")
      
      if (!token) {
        setError("You are not logged in.")
        return
      }
      
      const headers = { Authorization: `Bearer ${token}` }

      const [
        kitsRes,
        itemsRes,
        materialsRes,
        ordersRes,
        wcRes
      ] = await Promise.all([
        fetch("http://127.0.0.1:8000/staging-kitting/kits", { headers }),
        fetch("http://127.0.0.1:8000/staging-kitting/kit-items", { headers }),
        fetch("http://127.0.0.1:8000/staging-kitting/materials", { headers }),
        fetch("http://127.0.0.1:8000/production-orders/", { headers }),
        fetch("http://127.0.0.1:8000/production-schedules/work-centers", { headers })
      ])

      if (!kitsRes.ok) throw new Error("Failed to fetch kits")

      const kitsData = await kitsRes.json()
      const itemsData = itemsRes.ok ? await itemsRes.json() : []
      const materialsData = materialsRes.ok ? await materialsRes.json() : []
      const ordersData = ordersRes.ok ? await ordersRes.json() : []
      const wcData = wcRes.ok ? await wcRes.json() : []

      setKits(kitsData)
      setKitItems(itemsData)
      setMaterials(materialsData)
      setOrders(ordersData)
      setWorkCenters(wcData)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData()
  }, [])

  // Derived data
  const getEnrichedKits = () => {
    return kits.map(kit => {
      const order = orders.find(o => o.id === kit.production_order_id) || {}
      const wc = workCenters.find(w => w.id === kit.work_center_id) || {}
      const items = kitItems.filter(i => i.kit_id === kit.id).map(item => {
         const mat = materials.find(m => m.id === item.material_id) || {}
         return {
            ...item,
            materialCode: mat.material_code || `Mat-${item.material_id}`,
            materialName: mat.material_name || "Unknown",
            available: (mat.available_quantity || 0) - (mat.reserved_quantity || 0)
         }
      })

      let totalRequired = 0
      let totalStaged = 0

      items.forEach(i => {
        totalRequired += i.required_quantity
        totalStaged += i.staged_quantity
      })

      const readinessPct = totalRequired > 0 
        ? Math.round((totalStaged / totalRequired) * 100) 
        : 0

      return {
        ...kit,
        orderNumber: order.order_number || `Order #${kit.production_order_id}`,
        productName: order.product_name || `Product ID ${order.product_id}`,
        dueDate: order.due_date ? new Date(order.due_date).toLocaleString() : (kit.requested_at ? new Date(kit.requested_at).toLocaleString() : "N/A"),
        workCenterName: wc.name || `WC ${kit.work_center_id}`,
        totalRequired,
        totalStaged,
        readinessPct,
        items
      }
    })
  }

  const enrichedKits = getEnrichedKits()

  useEffect(() => {
    if (modalOpen && selectedKit) {
       const updatedKit = enrichedKits.find(k => k.id === selectedKit.id)
       if (updatedKit) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setSelectedKit(updatedKit)
       }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kits, kitItems, materials])

  const filteredKits = enrichedKits.filter(kit => {
    const search = searchTerm.toLowerCase()
    return (
      kit.orderNumber.toLowerCase().includes(search) ||
      kit.productName.toLowerCase().includes(search) ||
      kit.kit_number.toLowerCase().includes(search)
    )
  })

  // KPIs
  const readyKits = enrichedKits.filter(k => k.status === "KIT_PREPARED" || k.status === "STAGED").length
  const partialKits = enrichedKits.filter(k => k.status === "MATERIALS_RESERVED" || k.status === "SHORTAGE").length
  const pendingKits = enrichedKits.filter(k => k.status === "REQUESTED").length

  const handleAction = async (kitId, action) => {
    try {
      setActionLoading(true)
      setActionError("")
      const token = localStorage.getItem("access_token")

      const res = await fetch(`http://127.0.0.1:8000/staging-kitting/kits/${kitId}/${action}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.detail || `Failed to ${action} kit`)
      }

      await fetchData()
      // Note: We don't close the modal automatically here so users can see the status change,
      // except if they want to, but standard is to let them view the new state.
    } catch (err) {
      setActionError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "STAGED":
        return "badge-success"
      case "KIT_PREPARED":
        return "badge-blue"
      case "MATERIALS_RESERVED":
        return "badge-warning"
      case "SHORTAGE":
        return "badge-danger"
      case "REQUESTED":
      default:
        return "badge-neutral"
    }
  }
  
  const getDisplayStatus = (status) => {
     if (!status) return "Unknown"
     return status.replace(/_/g, ' ')
  }

  const openModal = (kit) => {
     setSelectedKit(kit)
     setModalOpen(true)
     setActionError("")
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-eyebrow">Execute</div>
          <h1 className="page-header-title">Material Staging &amp; Kitting</h1>
          <p className="page-header-subtitle">Prepare materials for upcoming production orders.</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-primary">
            <Package size={16} /> Print Pick Lists
          </button>
        </div>
      </div>

      {error && (
        <div className="card" style={{ padding: "var(--space-4)", marginBottom: "var(--space-6)", backgroundColor: "var(--color-status-danger-bg)", color: "var(--color-status-danger)", border: "1px solid var(--color-status-danger-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <AlertCircle size={16} />
            <span style={{ fontWeight: 500 }}>{error}</span>
          </div>
        </div>
      )}

      <div className="dashboard-kpi-row" style={{ marginBottom: "var(--space-6)" }}>
        <div className="card" style={{ padding: "var(--space-4)", borderLeft: "4px solid var(--color-status-success)" }}>
          <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", fontWeight: 500 }}>Ready to Move</div>
          <div style={{ fontSize: "var(--text-3xl)", fontWeight: 700, marginTop: "var(--space-2)" }}>{loading ? "-" : readyKits}</div>
        </div>
        <div className="card" style={{ padding: "var(--space-4)", borderLeft: "4px solid var(--color-status-warning)" }}>
          <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", fontWeight: 500 }}>Partially Staged</div>
          <div style={{ fontSize: "var(--text-3xl)", fontWeight: 700, marginTop: "var(--space-2)" }}>{loading ? "-" : partialKits}</div>
        </div>
        <div className="card" style={{ padding: "var(--space-4)", borderLeft: "4px solid var(--color-status-neutral)" }}>
          <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", fontWeight: 500 }}>Pending</div>
          <div style={{ fontSize: "var(--text-3xl)", fontWeight: 700, marginTop: "var(--space-2)" }}>{loading ? "-" : pendingKits}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header" style={{ paddingBottom: 0, borderBottom: "none" }}>
          <div className="search-input-container" style={{ width: 300 }}>
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              className="form-input search-input" 
              placeholder="Search by order or product..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? (
             <div style={{ padding: "var(--space-8)", textAlign: "center", color: "var(--color-text-muted)" }}>Loading kits...</div>
          ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Product</th>
                <th>Target Workcenter</th>
                <th>Required By</th>
                <th>Material Readiness</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredKits.map(kit => {
                const pct = kit.readinessPct
                const statusBadge = getStatusBadge(kit.status)
                
                return (
                  <tr key={kit.id}>
                    <td><span className="order-number">{kit.orderNumber}</span></td>
                    <td style={{ fontWeight: 500 }}>{kit.productName}</td>
                    <td><span className="chip">{kit.workCenterName}</span></td>
                    <td style={{ fontWeight: 600 }}>{kit.dueDate}</td>
                    <td style={{ minWidth: 200 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", marginBottom: 4 }}>
                        <span style={{ color: "var(--color-text-muted)" }}>{kit.totalStaged} of {kit.totalRequired} parts staged</span>
                        <span style={{ fontWeight: 600 }}>{pct}%</span>
                      </div>
                      <div className="progress-bar-track">
                        <div 
                          className={`progress-bar-fill ${pct === 100 ? 'progress-green' : 'progress-amber'}`} 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${statusBadge}`}>
                        {kit.status === "STAGED" && <CheckCircle2 size={12} style={{ marginRight: 4 }} />}
                        {kit.status === "SHORTAGE" && <AlertCircle size={12} style={{ marginRight: 4 }} />}
                        {getDisplayStatus(kit.status)}
                      </span>
                    </td>
                    <td>
                      <button 
                         className="btn btn-secondary" 
                         style={{ padding: "4px 12px", fontSize: "var(--text-xs)" }}
                         onClick={() => openModal(kit)}
                      >
                        Pick Materials
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filteredKits.length === 0 && (
                <tr>
                   <td colSpan="7" style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--color-text-muted)" }}>No kits found.</td>
                </tr>
              )}
            </tbody>
          </table>
          )}
        </div>
      </div>

      {modalOpen && selectedKit && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 800 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Pick Materials: {selectedKit.kit_number}</h2>
              <button className="icon-btn" onClick={() => setModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              {actionError && (
                <div className="card" style={{ padding: "var(--space-3)", marginBottom: "var(--space-4)", backgroundColor: "var(--color-status-danger-bg)", color: "var(--color-status-danger)", border: "1px solid var(--color-status-danger-border)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                    <AlertCircle size={16} />
                    <span style={{ fontWeight: 500, fontSize: "var(--text-sm)" }}>{actionError}</span>
                  </div>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
                 <div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "2px" }}>Order Number</div>
                    <div style={{ fontWeight: 500 }}>{selectedKit.orderNumber}</div>
                 </div>
                 <div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "2px" }}>Product</div>
                    <div style={{ fontWeight: 500 }}>{selectedKit.productName}</div>
                 </div>
                 <div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "2px" }}>Target Work Center</div>
                    <div style={{ fontWeight: 500 }}>{selectedKit.workCenterName}</div>
                 </div>
                 <div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "2px" }}>Status</div>
                    <div>
                       <span className={`badge ${getStatusBadge(selectedKit.status)}`}>
                         {getDisplayStatus(selectedKit.status)}
                       </span>
                    </div>
                 </div>
              </div>

              <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: "var(--space-3)", color: "var(--color-text-primary)" }}>Material Requirements</h3>
              
              <div className="table-wrapper" style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
                <table className="data-table">
                  <thead style={{ backgroundColor: "var(--color-bg-tertiary)" }}>
                    <tr>
                      <th>Material Code</th>
                      <th>Material Name</th>
                      <th>Available</th>
                      <th>Required</th>
                      <th>Staged</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedKit.items.length > 0 ? selectedKit.items.map(item => (
                      <tr key={item.id}>
                        <td style={{ fontWeight: 500 }}>{item.materialCode}</td>
                        <td>{item.materialName}</td>
                        <td style={{ color: item.available < item.required_quantity ? "var(--color-status-danger)" : "inherit" }}>
                           {item.available}
                        </td>
                        <td style={{ fontWeight: 600 }}>{item.required_quantity}</td>
                        <td style={{ color: item.staged_quantity === item.required_quantity ? "var(--color-status-success)" : "inherit" }}>
                           {item.staged_quantity}
                        </td>
                        <td>
                           <span className={`badge ${getStatusBadge(item.status)}`}>
                             {getDisplayStatus(item.status)}
                           </span>
                        </td>
                      </tr>
                    )) : (
                       <tr>
                          <td colSpan="6" style={{ textAlign: "center", padding: "var(--space-4)", color: "var(--color-text-muted)" }}>No material items found for this kit.</td>
                       </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)} disabled={actionLoading}>
                Close
              </button>
              
              {selectedKit.status === "REQUESTED" && (
                 <button 
                   className="btn btn-primary" 
                   onClick={() => handleAction(selectedKit.id, "reserve")}
                   disabled={actionLoading || selectedKit.items.length === 0}
                 >
                   {actionLoading ? "Reserving..." : "Reserve Materials"}
                 </button>
              )}

              {selectedKit.status === "MATERIALS_RESERVED" && (
                 <button 
                   className="btn btn-primary" 
                   onClick={() => handleAction(selectedKit.id, "prepare")}
                   disabled={actionLoading}
                 >
                   {actionLoading ? "Preparing..." : "Prepare Kit"}
                 </button>
              )}

              {selectedKit.status === "KIT_PREPARED" && (
                 <button 
                   className="btn btn-primary" 
                   onClick={() => handleAction(selectedKit.id, "stage")}
                   disabled={actionLoading}
                 >
                   {actionLoading ? "Staging..." : "Stage Kit"}
                 </button>
              )}

              {selectedKit.status === "STAGED" && (
                 <button className="btn btn-primary" disabled>
                   Kit Staged
                 </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StagingKitting
