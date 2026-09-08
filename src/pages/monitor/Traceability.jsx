import { useState } from "react"
import { Search, Link as LinkIcon, User, Package, Hammer, Truck } from "lucide-react"
import { mockTraceData } from "../../data/mockData"
import "../../styles/pages.css"
import "../../styles/components.css"

function Traceability() {
  const [searchTerm, setSearchTerm] = useState("SN-GH-00421")
  const [traceResult, setTraceResult] = useState(mockTraceData["SN-GH-00421"])

  const handleSearch = (e) => {
    e.preventDefault()
    setTraceResult(mockTraceData[searchTerm] || null)
  }

  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: "var(--space-6)" }}>
        <div className="page-header-left">
          <div className="page-header-eyebrow">Monitor & Assure</div>
          <h1 className="page-header-title">Genealogy & Traceability</h1>
          <p className="page-header-subtitle">Track forward and backward lineage for parts and batches.</p>
        </div>
      </div>

      <div className="card" style={{ padding: "var(--space-4)", marginBottom: "var(--space-6)", background: "var(--color-bg-surface)" }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "var(--space-4)" }}>
          <div className="search-input-container" style={{ flex: 1, maxWidth: 600 }}>
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              className="form-input search-input" 
              placeholder="Enter Lot Number, Serial Number, or Order Number..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ fontSize: "var(--text-md)", padding: "12px 12px 12px 36px" }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: "0 24px" }}>
            Trace
          </button>
        </form>
      </div>

      {traceResult ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }}>
          
          {/* Item Details */}
          <div className="card" style={{ padding: "var(--space-6)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", background: "var(--color-brand-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Package size={24} />
              </div>
              <div>
                <div style={{ fontSize: "var(--text-2xl)", fontWeight: 700 }}>{traceResult.serial}</div>
                <div style={{ color: "var(--color-text-secondary)" }}>{traceResult.product} ({traceResult.partNo})</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-5)" }}>
              <div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Work Order</div>
                <div className="order-number">{traceResult.orderId}</div>
              </div>
              <div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Batch / Lot</div>
                <div style={{ fontWeight: 600 }}>{traceResult.batch}</div>
              </div>
              <div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Status</div>
                <span className={`badge ${traceResult.status === 'Shipped' ? 'badge-success' : 'badge-info'}`}>{traceResult.status}</span>
              </div>
              <div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Manufactured</div>
                <div style={{ fontWeight: 500 }}>{traceResult.manufactured}</div>
              </div>
            </div>
            
            <div style={{ borderTop: "1px solid var(--color-border)", margin: "var(--space-5) 0", paddingTop: "var(--space-5)", display: "flex", gap: "var(--space-6)" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--color-text-secondary)", marginBottom: 4 }}>
                  <User size={14} /> <span style={{ fontSize: "var(--text-xs)", textTransform: "uppercase" }}>Operator</span>
                </div>
                <div style={{ fontWeight: 500 }}>{traceResult.operator}</div>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--color-text-secondary)", marginBottom: 4 }}>
                  <Truck size={14} /> <span style={{ fontSize: "var(--text-xs)", textTransform: "uppercase" }}>Current Location</span>
                </div>
                <div style={{ fontWeight: 500 }}>{traceResult.location}</div>
              </div>
            </div>
          </div>

          {/* Trace Tree / Components */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <LinkIcon size={18} style={{ color: "var(--color-text-muted)" }} />
                <div className="card-title">Backward Traceability</div>
              </div>
            </div>
            <div className="card-body" style={{ padding: "var(--space-4)" }}>
              {traceResult.components && traceResult.components.length > 0 ? (
                <div className="timeline">
                  {traceResult.components.map((comp, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-line">
                        <div className="timeline-dot timeline-dot-blue">
                          <span style={{ fontSize: 10 }}><Hammer size={10} /></span>
                        </div>
                        {idx !== traceResult.components.length - 1 && <div className="timeline-connector" />}
                      </div>
                      <div className="timeline-content" style={{ paddingBottom: "var(--space-4)" }}>
                        <div className="timeline-title" style={{ fontFamily: "monospace", fontSize: "var(--text-md)" }}>{comp}</div>
                        <div className="timeline-meta">Consumed in operation</div>
                        <div style={{ marginTop: "var(--space-2)" }}>
                          <button className="btn btn-secondary" style={{ padding: "2px 8px", fontSize: "11px" }}>Trace Parent</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "var(--space-6)", textAlign: "center", color: "var(--color-text-muted)" }}>
                  No backward traceability data available for this item (Root component).
                </div>
              )}
            </div>
          </div>

        </div>
      ) : (
        <div className="card" style={{ padding: "var(--space-12)", textAlign: "center" }}>
          <Search size={48} style={{ color: "var(--color-border-strong)", margin: "0 auto var(--space-4)" }} />
          <h3 style={{ fontSize: "var(--text-xl)", fontWeight: 600, marginBottom: "var(--space-2)" }}>No Traceability Record Found</h3>
          <p style={{ color: "var(--color-text-secondary)" }}>Check the serial number, lot number, or work order ID and try again.</p>
          <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)", marginTop: "var(--space-4)" }}>Hint: Try SN-GH-00421 or WO-2401</p>
        </div>
      )}
    </div>
  )
}

export default Traceability
