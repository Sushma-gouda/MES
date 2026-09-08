import { useState } from "react"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import { mockNCRs, mockInspectionResults } from "../../data/mockData"
import "../../styles/pages.css"
import "../../styles/components.css"

function QualityManagement() {
  const [activeTab, setActiveTab] = useState("inspections") // inspections, ncrs

  const totalInspected = mockInspectionResults.reduce((acc, curr) => acc + curr.inspected, 0)
  const totalPassed = mockInspectionResults.reduce((acc, curr) => acc + curr.passed, 0)
  const avgYield = (totalPassed / totalInspected * 100).toFixed(1)

  const openNCRs = mockNCRs.filter(n => n.status !== "Closed").length

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-eyebrow">Monitor & Assure</div>
          <h1 className="page-header-title">Quality Management</h1>
          <p className="page-header-subtitle">Track inspections, non-conformances, and yield.</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-secondary">
            <ShieldCheck size={16} /> Log Inspection
          </button>
          <button className="btn btn-primary" style={{ background: "var(--color-status-danger)", borderColor: "var(--color-status-danger)" }}>
            <ShieldAlert size={16} /> Raise NCR
          </button>
        </div>
      </div>

      <div className="dashboard-kpi-row" style={{ marginBottom: "var(--space-6)" }}>
        <div className="card" style={{ padding: "var(--space-4)" }}>
          <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", fontWeight: 500 }}>Overall Yield</div>
          <div style={{ fontSize: "var(--text-3xl)", fontWeight: 700, marginTop: "var(--space-2)", color: avgYield >= 98 ? "var(--color-status-success)" : "var(--color-status-warning)" }}>
            {avgYield}%
          </div>
        </div>
        <div className="card" style={{ padding: "var(--space-4)" }}>
          <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", fontWeight: 500 }}>Total Units Inspected</div>
          <div style={{ fontSize: "var(--text-3xl)", fontWeight: 700, marginTop: "var(--space-2)" }}>{totalInspected}</div>
        </div>
        <div className="card" style={{ padding: "var(--space-4)", borderLeft: openNCRs > 0 ? "4px solid var(--color-status-danger)" : "" }}>
          <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", fontWeight: 500 }}>Active NCRs</div>
          <div style={{ fontSize: "var(--text-3xl)", fontWeight: 700, marginTop: "var(--space-2)", color: openNCRs > 0 ? "var(--color-status-danger)" : "inherit" }}>
            {openNCRs}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header" style={{ paddingBottom: 0, borderBottom: "none" }}>
          <div style={{ display: "flex", gap: "var(--space-4)", borderBottom: "1px solid var(--color-border)" }}>
            <button 
              className={`btn btn-secondary ${activeTab === 'inspections' ? 'active' : ''}`} 
              style={{ border: "none", background: "none", borderBottom: activeTab === 'inspections' ? "2px solid var(--color-brand-primary)" : "2px solid transparent", borderRadius: 0, paddingBottom: 12, fontWeight: activeTab === 'inspections' ? 600 : 400 }}
              onClick={() => setActiveTab("inspections")}
            >
              Recent Inspections
            </button>
            <button 
              className={`btn btn-secondary ${activeTab === 'ncrs' ? 'active' : ''}`} 
              style={{ border: "none", background: "none", borderBottom: activeTab === 'ncrs' ? "2px solid var(--color-brand-primary)" : "2px solid transparent", borderRadius: 0, paddingBottom: 12, fontWeight: activeTab === 'ncrs' ? 600 : 400 }}
              onClick={() => setActiveTab("ncrs")}
            >
              Non-Conformance Reports (NCR)
            </button>
          </div>
        </div>

        <div className="table-wrapper" style={{ border: "none", borderRadius: 0, boxShadow: "none" }}>
          {activeTab === "inspections" && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Batch / Order</th>
                  <th>Date</th>
                  <th>Inspected Qty</th>
                  <th>Passed</th>
                  <th>Failed</th>
                  <th>Yield</th>
                  <th>Inspector</th>
                </tr>
              </thead>
              <tbody>
                {mockInspectionResults.map((result, i) => (
                  <tr key={i}>
                    <td>
                      <div className="table-cell-strong">{result.batch}</div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{result.orderId}</div>
                    </td>
                    <td>{result.date}</td>
                    <td style={{ fontWeight: 500 }}>{result.inspected}</td>
                    <td style={{ color: "var(--color-status-success)", fontWeight: 600 }}>{result.passed}</td>
                    <td style={{ color: result.failed > 0 ? "var(--color-status-danger)" : "var(--color-text-muted)", fontWeight: result.failed > 0 ? 600 : 400 }}>{result.failed}</td>
                    <td>
                      <span className={`badge ${result.yieldRate >= 98 ? 'badge-success' : 'badge-warning'}`}>
                        {result.yieldRate}%
                      </span>
                    </td>
                    <td><span className="chip">{result.inspector}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "ncrs" && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>NCR ID</th>
                  <th>Order / Product</th>
                  <th>Defect Description</th>
                  <th>Severity</th>
                  <th>Qty Affected</th>
                  <th>Status</th>
                  <th>Raised By</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {mockNCRs.map(ncr => {
                  let sevBadge = "badge-neutral"
                  if (ncr.severity === "Critical") sevBadge = "priority-critical"
                  if (ncr.severity === "Major") sevBadge = "priority-high"
                  if (ncr.severity === "Minor") sevBadge = "badge-warning"

                  let statusBadge = "badge-neutral"
                  if (ncr.status === "Open") statusBadge = "badge-danger"
                  if (ncr.status === "Under Review") statusBadge = "badge-warning"
                  if (ncr.status === "Closed") statusBadge = "badge-success"

                  return (
                    <tr key={ncr.id}>
                      <td><span className="order-number">{ncr.id}</span></td>
                      <td>
                        <div className="table-cell-strong">{ncr.orderId}</div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{ncr.product}</div>
                      </td>
                      <td style={{ fontWeight: 500, color: "var(--color-status-danger)" }}>{ncr.defect}</td>
                      <td><span className={`badge ${sevBadge}`}>{ncr.severity}</span></td>
                      <td>{ncr.qty} units</td>
                      <td><span className={`badge ${statusBadge}`}>{ncr.status}</span></td>
                      <td>{ncr.raisedBy}</td>
                      <td style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>{ncr.date}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default QualityManagement
