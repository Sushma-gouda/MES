import { Link } from "react-router-dom"
import "../styles/landing.css"

const FactoryIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20V8l6-4v4l6-4v4l6-4v16" /><path d="M2 20h20" />
    <rect x="8" y="14" width="3" height="6" /><rect x="13" y="14" width="3" height="6" />
  </svg>
)

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

const capabilities = [
  {
    icon: "📋",
    colorClass: "cap-blue",
    title: "Production Planning",
    desc: "Release work orders, allocate resources, and schedule production with real-time capacity visibility.",
    features: ["Work order management", "Capacity scheduling", "Priority-based planning", "Multi-plant support"],
  },
  {
    icon: "⚙️",
    colorClass: "cap-green",
    title: "Shop-Floor Execution",
    desc: "Paperless operator guidance, machine setup verification, and real-time job tracking on the production floor.",
    features: ["Paperless work instructions", "Machine setup checklists", "Operator job queues", "Step-by-step execution"],
  },
  {
    icon: "📈",
    colorClass: "cap-amber",
    title: "OEE & Performance",
    desc: "Monitor Overall Equipment Effectiveness with live availability, performance, and quality metrics.",
    features: ["Live OEE dashboards", "Downtime categorization", "Shift-level KPIs", "Trend analysis"],
  },
  {
    icon: "🔍",
    colorClass: "cap-teal",
    title: "Quality Management",
    desc: "Raise NCRs, manage inspection results, enforce quality gates, and track defect Pareto analysis.",
    features: ["NCR & CAPA management", "Inspection checklists", "Batch hold & release", "Quality trend charts"],
  },
  {
    icon: "🔗",
    colorClass: "cap-purple",
    title: "Traceability",
    desc: "Full forward and backward traceability from raw material to finished product and customer shipment.",
    features: ["Serial & lot tracking", "Component genealogy", "Material lineage", "Recall readiness"],
  },
  {
    icon: "📦",
    colorClass: "cap-red",
    title: "Inventory & Dispatch",
    desc: "Manage material consumption, backflush completions, maintain stock levels, and coordinate dispatch.",
    features: ["Inventory backflush", "Stock level monitoring", "Reorder alerting", "Dispatch coordination"],
  },
]

const workflowSteps = [
  { num: 1, title: "Plan & Release", desc: "Create and release production orders based on demand and capacity" },
  { num: 2, title: "Stage & Kit", desc: "Pick and stage all materials and components for each work order" },
  { num: 3, title: "Execute", desc: "Operators execute jobs step-by-step with guided digital work instructions" },
  { num: 4, title: "Monitor & Assure", desc: "Live OEE monitoring, quality inspections and traceability capture" },
  { num: 5, title: "Close & Dispatch", desc: "Backflush consumption, close orders, and coordinate dispatch to customers" },
]

const trustItems = [
  { icon: "🏭", title: "Built for Manufacturing", desc: "Designed around real MES workflows used by production planners, supervisors, and quality teams." },
  { icon: "⚡", title: "Real-Time Visibility", desc: "Every production event captured instantly — no manual data entry, no delays, no gaps." },
  { icon: "🔒", title: "Enterprise Security", desc: "Role-based access control, JWT authentication, and audit trails for every critical operation." },
  { icon: "📱", title: "Works Everywhere", desc: "Responsive design works on desktop workstations, tablets on the shop floor, and mobile devices." },
]

function LandingPage() {
  return (
    <div className="landing-root">
      {/* Navbar */}
      <nav className="landing-nav">
        <Link to="/" className="landing-nav-brand" aria-label="MES Home">
          <div className="landing-nav-icon"><FactoryIcon /></div>
          <span className="landing-nav-name">Nexus<span>MES</span></span>
        </Link>

        <div className="landing-nav-links">
          <a href="#capabilities" className="landing-nav-link">Capabilities</a>
          <a href="#workflow" className="landing-nav-link">How It Works</a>
          <a href="#metrics" className="landing-nav-link">Results</a>
        </div>

        <div className="landing-nav-actions">
          <Link to="/login" className="btn btn-outline" style={{ height: 36, padding: "0 16px", fontSize: "0.875rem", fontWeight: 500, borderRadius: 6, border: "1.5px solid var(--color-border)", color: "var(--color-text-secondary)", background: "transparent", display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
            Sign In
          </Link>
          <Link to="/signup" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "0 16px", height: 36,
            background: "var(--color-brand-primary)", color: "#fff",
            fontSize: "0.875rem", fontWeight: 600, borderRadius: 6, textDecoration: "none",
            transition: "background 0.18s ease"
          }}>
            Get Started <ArrowRight />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero" id="home">
        <div className="hero-bg-grid" />
        <div className="hero-bg-glow-1" />
        <div className="hero-bg-glow-2" />

        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            Manufacturing Execution System
          </div>

          <h1 className="hero-title">
            Complete control over your{" "}
            <span className="hero-title-accent">production floor</span>
          </h1>

          <p className="hero-subtitle">
            MES connects planning, execution, quality, and dispatch into one unified platform.
            From work order release to customer delivery — every step tracked, every metric visible.
          </p>

          <div className="hero-actions">
            <Link to="/signup" className="btn-hero-primary">
              Start Free Trial <ArrowRight />
            </Link>
            <Link to="/login" className="btn-hero-secondary">
              Sign In to your workspace
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">85%+</div>
              <div className="hero-stat-label">Average OEE achieved</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">60%</div>
              <div className="hero-stat-label">Reduction in paper-based work</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">100%</div>
              <div className="hero-stat-label">Traceability coverage</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">Real-time</div>
              <div className="hero-stat-label">Production visibility</div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="landing-section capabilities-section" id="capabilities">
        <div className="landing-section-inner">
          <p className="section-eyebrow">Core Capabilities</p>
          <h2 className="section-title">Everything your production team needs</h2>
          <p className="section-subtitle">
            MES covers the full MES scope — from planning to dispatch — in a single integrated platform.
          </p>

          <div className="capabilities-grid">
            {capabilities.map((cap) => (
              <div key={cap.title} className="capability-card">
                <div className={`capability-icon ${cap.colorClass}`}>{cap.icon}</div>
                <h3 className="capability-title">{cap.title}</h3>
                <p className="capability-desc">{cap.desc}</p>
                <ul className="capability-features">
                  {cap.features.map(f => (
                    <li key={f} className="capability-feature">{f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics banner */}
      <div className="metrics-banner" id="metrics">
        <div className="metrics-inner">
          <div className="metric-item">
            <div className="metric-value"><span className="metric-value-accent">83</span>%</div>
            <div className="metric-label">Average OEE improvement in first 6 months</div>
          </div>
          <div className="metric-item">
            <div className="metric-value"><span className="metric-value-accent">4x</span></div>
            <div className="metric-label">Faster NCR resolution with digital quality workflows</div>
          </div>
          <div className="metric-item">
            <div className="metric-value"><span className="metric-value-accent">0</span></div>
            <div className="metric-label">Untraced components — full lot and serial genealogy</div>
          </div>
          <div className="metric-item">
            <div className="metric-value"><span className="metric-value-accent">18</span></div>
            <div className="metric-label">Integrated MES modules in one platform</div>
          </div>
        </div>
      </div>

      {/* Workflow */}
      <section className="landing-section workflow-section" id="workflow">
        <div className="landing-section-inner">
          <p className="section-eyebrow">How It Works</p>
          <h2 className="section-title">The complete MES workflow</h2>
          <p className="section-subtitle">
            MES guides your team through every stage of the production lifecycle.
          </p>

          <div className="workflow-steps" style={{ marginTop: "var(--space-12)" }}>
            {workflowSteps.map((step) => (
              <div key={step.num} className="workflow-step">
                <div className="workflow-step-number">{step.num}</div>
                <h3 className="workflow-step-title">{step.title}</h3>
                <p className="workflow-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="landing-section trust-section">
        <div className="landing-section-inner">
          <p className="section-eyebrow">Why MES</p>
          <h2 className="section-title">Built for real manufacturing operations</h2>

          <div className="trust-grid">
            {trustItems.map((item) => (
              <div key={item.title} className="trust-card">
                <div className="trust-card-icon">{item.icon}</div>
                <h3 className="trust-card-title">{item.title}</h3>
                <p className="trust-card-desc">{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "var(--space-12)", textAlign: "center" }}>
            <h3 style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--font-bold)", color: "var(--color-text-primary)", marginBottom: "var(--space-4)" }}>
              Ready to transform your production floor?
            </h3>
            <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/signup" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 32px", background: "var(--color-brand-primary)", color: "#fff",
                fontWeight: 600, fontSize: "1rem", borderRadius: 8, textDecoration: "none"
              }}>
                Get Started Free <ArrowRight />
              </Link>
              <Link to="/login" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 32px", background: "transparent", color: "var(--color-brand-primary)",
                fontWeight: 600, fontSize: "1rem", borderRadius: 8, textDecoration: "none",
                border: "1.5px solid var(--color-brand-primary)"
              }}>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="footer-top">
            <div className="footer-brand-col">
              <div className="footer-brand-logo">
                <div className="footer-brand-icon"><FactoryIcon /></div>
                <span className="footer-brand-name">Nexus<span>MES</span></span>
              </div>
              <p className="footer-tagline">
                Professional Manufacturing Execution System for modern production environments.
              </p>
            </div>

            <div>
              <div className="footer-col-title">Product</div>
              <ul className="footer-col-links">
                <li><a href="#capabilities">Capabilities</a></li>
                <li><a href="#workflow">How It Works</a></li>
                <li><a href="#metrics">Results</a></li>
              </ul>
            </div>

            <div>
              <div className="footer-col-title">Platform</div>
              <ul className="footer-col-links">
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/production-orders">Production Orders</a></li>
                <li><a href="/quality">Quality Management</a></li>
                <li><a href="/oee">OEE Monitoring</a></li>
              </ul>
            </div>

            <div>
              <div className="footer-col-title">Security</div>
              <ul className="footer-col-links">
                <li><a href="#">JWT Authentication</a></li>
                <li><a href="#">Role-Based Access</a></li>
                <li><a href="#">Audit Trail</a></li>
                <li><a href="#">Data Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 MES. All rights reserved.</span>
            <span>Manufacturing Execution System · Production Intelligence Platform</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
