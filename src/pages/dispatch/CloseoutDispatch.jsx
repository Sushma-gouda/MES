import { useState } from "react"
import { Truck, Search, FileText } from "lucide-react"
import { mockDispatch } from "../../data/mockData"
import "../../styles/pages.css"
import "../../styles/components.css"

function CloseoutDispatch() {
  const [searchTerm, setSearchTerm] = useState("")

  const readyToShip = mockDispatch.filter(d => d.status === "Ready").length
  const dispatched = mockDispatch.filter(d => d.status === "Dispatched").length

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-eyebrow">Close & Dispatch</div>
          <h1 className="page-header-title">Order Closeout & Shipping</h1>
          <p className="page-header-subtitle">Finalize production orders and generate dispatch notes.</p>
        </div>
      </div>

      <div className="dashboard-kpi-row" style={{ marginBottom: "var(--space-6)" }}>
        <div className="card" style={{ padding: "var(--space-4)" }}>
          <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", fontWeight: 500 }}>Ready to Ship</div>
          <div style={{ fontSize: "var(--text-3xl)", fontWeight: 700, marginTop: "var(--space-2)", color: "var(--color-status-info)" }}>{readyToShip}</div>
        </div>
        <div className="card" style={{ padding: "var(--space-4)" }}>
          <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", fontWeight: 500 }}>Dispatched (Last 7 days)</div>
          <div style={{ fontSize: "var(--text-3xl)", fontWeight: 700, marginTop: "var(--space-2)", color: "var(--color-status-success)" }}>{dispatched}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="search-input-container" style={{ width: 300 }}>
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              className="form-input search-input" 
              placeholder="Search by Dispatch ID or Order..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Dispatch ID</th>
                <th>Work Order</th>
                <th>Product</th>
                <th>Customer</th>
                <th>Qty</th>
                <th>Scheduled Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockDispatch.map(item => (
                <tr key={item.id}>
                  <td><span className="order-number">{item.id}</span></td>
                  <td style={{ fontWeight: 500 }}>{item.orderId}</td>
                  <td>{item.product}</td>
                  <td style={{ color: "var(--color-text-secondary)" }}>{item.customer}</td>
                  <td style={{ fontWeight: 600 }}>{item.qty}</td>
                  <td>{item.scheduledDate}</td>
                  <td>
                    <span className={`badge ${item.status === 'Ready' ? 'badge-info' : 'badge-success'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "var(--space-2)" }}>
                      <button className="btn btn-secondary btn-icon" title="View Dispatch Note">
                        <FileText size={16} />
                      </button>
                      {item.status === "Ready" && (
                        <button className="btn btn-primary btn-icon" title="Confirm Dispatch" style={{ background: "var(--color-status-success)", borderColor: "var(--color-status-success)" }}>
                          <Truck size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CloseoutDispatch
