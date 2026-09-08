import { useState } from "react"
import { Search, PackageMinus, Filter, AlertCircle } from "lucide-react"
import { mockInventory, mockBackflush } from "../../data/mockData"
import "../../styles/pages.css"
import "../../styles/components.css"

function InventoryBackflush() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredInventory = mockInventory.filter(item => 
    item.partNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const lowStockCount = mockInventory.filter(i => i.status === "Low" || i.status === "Critical").length

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-eyebrow">Close & Dispatch</div>
          <h1 className="page-header-title">Inventory & Backflush</h1>
          <p className="page-header-subtitle">Manage material stock and automatic consumption.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "var(--space-6)" }}>
        
        {/* Inventory Table */}
        <div className="card">
          <div className="card-header" style={{ paddingBottom: 0, borderBottom: "none" }}>
            <div style={{ display: "flex", gap: "var(--space-4)" }}>
              <div className="search-input-container" style={{ flex: 1, maxWidth: 400 }}>
                <Search className="search-icon" size={16} />
                <input 
                  type="text" 
                  className="form-input search-input" 
                  placeholder="Search materials..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn btn-secondary btn-icon" title="Filter"><Filter size={16} /></button>
            </div>
            
            {lowStockCount > 0 && (
              <div style={{ marginTop: "var(--space-4)", display: "flex", alignItems: "center", gap: 8, background: "var(--color-status-warning-bg)", color: "var(--color-status-warning)", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-status-warning-border)", fontSize: "var(--text-sm)", fontWeight: 500 }}>
                <AlertCircle size={16} />
                {lowStockCount} materials are running low and require reordering.
              </div>
            )}
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Part No / Name</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>On Hand</th>
                  <th>Stock Level</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map(item => {
                  const pct = Math.min(100, Math.round((item.onHand / item.maxStock) * 100))
                  const isLow = item.onHand <= item.minStock
                  
                  return (
                    <tr key={item.partNo}>
                      <td>
                        <div className="table-cell-strong">{item.partNo}</div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{item.name}</div>
                      </td>
                      <td><span className="chip">{item.category}</span></td>
                      <td style={{ color: "var(--color-text-secondary)" }}>{item.location}</td>
                      <td style={{ fontWeight: 600, color: isLow ? "var(--color-status-danger)" : "inherit" }}>
                        {item.onHand} {item.uom}
                      </td>
                      <td style={{ minWidth: 100 }}>
                        <div className="progress-bar-track">
                          <div 
                            className={`progress-bar-fill ${isLow ? 'progress-red' : pct < 50 ? 'progress-amber' : 'progress-green'}`} 
                            style={{ width: `${pct}%` }} 
                          />
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${item.status === 'OK' ? 'badge-success' : item.status === 'Low' ? 'badge-warning' : 'badge-danger'}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Backflush History */}
        <div className="card" style={{ height: "fit-content" }}>
          <div className="card-header">
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <PackageMinus size={18} style={{ color: "var(--color-brand-primary)" }} />
              <div className="card-title">Recent Backflush</div>
            </div>
          </div>
          <div className="card-body" style={{ padding: "0 var(--space-4) var(--space-4) var(--space-4)" }}>
            <div className="timeline">
              {mockBackflush.map((tx, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-line">
                    <div className="timeline-dot timeline-dot-green">
                      <span style={{ fontSize: 10 }}>✓</span>
                    </div>
                    {idx !== mockBackflush.length - 1 && <div className="timeline-connector" />}
                  </div>
                  <div className="timeline-content" style={{ paddingBottom: "var(--space-4)" }}>
                    <div className="timeline-title">Order {tx.orderId}</div>
                    <div className="timeline-meta">{tx.product} (Qty: {tx.qty})</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "var(--space-2)" }}>
                      <span className="chip" style={{ fontSize: "10px" }}>{tx.batch}</span>
                      <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{tx.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="btn btn-secondary" style={{ width: "100%", justifyContent: "center" }}>View All Transactions</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventoryBackflush
