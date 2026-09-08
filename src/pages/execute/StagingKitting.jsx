import { useState } from "react"
import { Package, Search, AlertCircle, CheckCircle2 } from "lucide-react"
import { mockStagingOrders } from "../../data/mockData"
import "../../styles/pages.css"
import "../../styles/components.css"

function StagingKitting() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredOrders = mockStagingOrders.filter(order => 
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order.product.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pending = mockStagingOrders.filter(o => o.status === "Pending").length
  const partial = mockStagingOrders.filter(o => o.status === "Partial").length
  const ready = mockStagingOrders.filter(o => o.status === "Ready").length

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-eyebrow">Execute</div>
          <h1 className="page-header-title">Material Staging & Kitting</h1>
          <p className="page-header-subtitle">Prepare materials for upcoming production orders.</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-primary">
            <Package size={16} /> Print Pick Lists
          </button>
        </div>
      </div>

      <div className="dashboard-kpi-row" style={{ marginBottom: "var(--space-6)" }}>
        <div className="card" style={{ padding: "var(--space-4)", borderLeft: "4px solid var(--color-status-success)" }}>
          <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", fontWeight: 500 }}>Ready to Move</div>
          <div style={{ fontSize: "var(--text-3xl)", fontWeight: 700, marginTop: "var(--space-2)" }}>{ready}</div>
        </div>
        <div className="card" style={{ padding: "var(--space-4)", borderLeft: "4px solid var(--color-status-warning)" }}>
          <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", fontWeight: 500 }}>Partially Staged</div>
          <div style={{ fontSize: "var(--text-3xl)", fontWeight: 700, marginTop: "var(--space-2)" }}>{partial}</div>
        </div>
        <div className="card" style={{ padding: "var(--space-4)", borderLeft: "4px solid var(--color-status-neutral)" }}>
          <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", fontWeight: 500 }}>Pending</div>
          <div style={{ fontSize: "var(--text-3xl)", fontWeight: 700, marginTop: "var(--space-2)" }}>{pending}</div>
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
              {filteredOrders.map(order => {
                const pct = Math.round((order.staged / order.totalParts) * 100)
                let statusBadge = "badge-neutral"
                if (order.status === "Ready") statusBadge = "badge-success"
                if (order.status === "Partial") statusBadge = "badge-warning"
                
                return (
                  <tr key={order.orderId}>
                    <td><span className="order-number">{order.orderId}</span></td>
                    <td style={{ fontWeight: 500 }}>{order.product}</td>
                    <td><span className="chip">{order.workcenter}</span></td>
                    <td style={{ fontWeight: 600 }}>{order.dueTime}</td>
                    <td style={{ minWidth: 200 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", marginBottom: 4 }}>
                        <span style={{ color: "var(--color-text-muted)" }}>{order.staged} of {order.totalParts} parts staged</span>
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
                        {order.status === "Ready" && <CheckCircle2 size={12} style={{ marginRight: 4 }} />}
                        {order.status === "Partial" && <AlertCircle size={12} style={{ marginRight: 4 }} />}
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-secondary" style={{ padding: "4px 12px", fontSize: "var(--text-xs)" }}>
                        Pick Materials
                      </button>
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

export default StagingKitting
