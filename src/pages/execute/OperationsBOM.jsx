import { Layers, ListOrdered, Share2 } from "lucide-react"
import { mockBOMItems, mockOperations } from "../../data/mockData"
import "../../styles/pages.css"
import "../../styles/components.css"

function OperationsBOM() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-eyebrow">Execute</div>
          <h1 className="page-header-title">Operations & BOM</h1>
          <p className="page-header-subtitle">Gear Housing Assy (GH-7732-A) — Revision B</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-secondary">
            <Share2 size={16} /> Export Routing
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "var(--space-6)" }}>
        
        {/* Bill of Materials */}
        <div className="card" style={{ gridColumn: "span 6" }}>
          <div className="card-header">
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <Layers size={18} style={{ color: "var(--color-brand-primary)" }} />
              <div className="card-title">Bill of Materials (BOM)</div>
            </div>
          </div>
          <div className="table-wrapper" style={{ border: "none", borderRadius: 0, boxShadow: "none" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Part No</th>
                  <th>Description</th>
                  <th>Qty</th>
                </tr>
              </thead>
              <tbody>
                {mockBOMItems.map((item, idx) => (
                  <tr key={idx} style={{ background: item.level === 0 ? "var(--color-bg-muted)" : "transparent" }}>
                    <td style={{ paddingLeft: item.level * 20 + 16 }}>
                      {item.level === 0 ? (
                        <span className="badge badge-blue">Parent</span>
                      ) : (
                        <span style={{ color: "var(--color-text-muted)" }}>L{item.level}</span>
                      )}
                    </td>
                    <td><span className="order-number">{item.partNo}</span></td>
                    <td style={{ fontWeight: item.level === 0 ? 600 : 400 }}>{item.name}</td>
                    <td>{item.qty} {item.uom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Operations Routing */}
        <div className="card" style={{ gridColumn: "span 6" }}>
          <div className="card-header">
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <ListOrdered size={18} style={{ color: "var(--color-brand-accent)" }} />
              <div className="card-title">Routing & Operations</div>
            </div>
          </div>
          <div className="card-body" style={{ padding: "var(--space-4)" }}>
            <div className="timeline">
              {mockOperations.map((op, idx) => (
                <div key={op.seq} className="timeline-item">
                  <div className="timeline-line">
                    <div className="timeline-dot" style={{ width: 24, height: 24, background: "var(--color-bg-muted)", border: "2px solid var(--color-border-strong)", color: "var(--color-text-secondary)", fontSize: 10, fontWeight: 700 }}>
                      {op.seq}
                    </div>
                    {idx !== mockOperations.length - 1 && <div className="timeline-connector" />}
                  </div>
                  <div className="timeline-content" style={{ paddingBottom: "var(--space-4)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-2)" }}>
                      <div className="timeline-title" style={{ fontSize: "var(--text-base)" }}>{op.name}</div>
                      <span className="chip">{op.workcenter}</span>
                    </div>
                    
                    <div style={{ gap: "var(--space-4)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", background: "var(--color-bg-muted)", padding: "var(--space-2) var(--space-3)", borderRadius: "var(--radius-sm)", display: "inline-flex" }}>
                      <div><span style={{ fontWeight: 600 }}>Setup:</span> {op.setupTime} min</div>
                      <div><span style={{ fontWeight: 600 }}>Run/pc:</span> {op.runTime} min</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default OperationsBOM
