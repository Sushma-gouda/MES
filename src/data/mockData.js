// ===== CENTRALIZED MOCK DATA LAYER =====
// Replace individual exports with real API calls when backend is ready

// ===== CURRENT USER / SESSION =====
export const mockUser = {
  id: 1,
  name: "Priya Sharma",
  email: "priya.sharma@nexusmes.io",
  role: "Production Supervisor",
  plant: "Plant A — Pune",
  avatar: "PS",
}

export const mockPlants = [
  { id: "PLT-A", name: "Plant A — Pune", status: "running" },
  { id: "PLT-B", name: "Plant B — Mumbai", status: "running" },
  { id: "PLT-C", name: "Plant C — Chennai", status: "idle" },
]

// ===== SHIFT =====
export const mockCurrentShift = {
  name: "Morning Shift",
  code: "S1",
  start: "06:00",
  end: "14:00",
  supervisor: "Priya Sharma",
  operators: 18,
  date: "Sep 3, 2026",
}

// ===== DASHBOARD KPIs =====
export const mockDashboardKPIs = {
  ordersDueToday: { value: 12, delta: "+2", trend: "up" },
  inProgress: { value: 7, delta: "+1", trend: "up" },
  completedToday: { value: 5, delta: "-1", trend: "down" },
  qualityIssues: { value: 3, delta: "+3", trend: "down" },
  oee: { value: 83.4, delta: "+1.2%", trend: "up" },
  availability: { value: 91.2, delta: "+0.8%", trend: "up" },
  performance: { value: 87.6, delta: "-0.5%", trend: "down" },
  quality: { value: 98.7, delta: "+0.2%", trend: "up" },
}

// ===== PRODUCTION TREND CHART DATA =====
export const mockProductionTrend = [
  { time: "06:00", target: 80, actual: 75, quality: 73 },
  { time: "07:00", target: 80, actual: 82, quality: 80 },
  { time: "08:00", target: 80, actual: 78, quality: 76 },
  { time: "09:00", target: 80, actual: 85, quality: 84 },
  { time: "10:00", target: 80, actual: 90, quality: 88 },
  { time: "11:00", target: 80, actual: 86, quality: 85 },
  { time: "12:00", target: 80, actual: 79, quality: 77 },
  { time: "13:00", target: 80, actual: 83, quality: 82 },
]

// ===== MACHINES =====
export const mockMachines = [
  { id: "CNC-01", name: "CNC Lathe 1", status: "running", uptime: "97.2%", job: "WO-2401" },
  { id: "CNC-02", name: "CNC Lathe 2", status: "running", uptime: "94.8%", job: "WO-2402" },
  { id: "CNC-03", name: "CNC Lathe 3", status: "idle", uptime: "—", job: null },
  { id: "VMC-01", name: "VMC Machine 1", status: "running", uptime: "99.1%", job: "WO-2403" },
  { id: "VMC-02", name: "VMC Machine 2", status: "down", uptime: "—", job: null, issue: "Spindle fault" },
  { id: "GRD-01", name: "Grinder 1", status: "setup", uptime: "—", job: "WO-2405" },
  { id: "ASM-01", name: "Assembly Line 1", status: "running", uptime: "88.5%", job: "WO-2406" },
  { id: "ASM-02", name: "Assembly Line 2", status: "running", uptime: "91.0%", job: "WO-2407" },
  { id: "TRN-01", name: "Transfer Press", status: "running", uptime: "96.4%", job: "WO-2408" },
  { id: "INS-01", name: "Inspection Station 1", status: "idle", uptime: "—", job: null },
  { id: "WLD-01", name: "Welding Cell 1", status: "running", uptime: "93.7%", job: "WO-2410" },
  { id: "CMM-01", name: "CMM Station", status: "running", uptime: "100%", job: "WO-2411" },
]

// ===== ALERTS =====
export const mockAlerts = [
  { id: 1, type: "critical", title: "VMC-02 Spindle Fault — Machine Down", meta: "Reported 08:24 · Maintenance notified", icon: "⚠️" },
  { id: 2, type: "warning", title: "WO-2398 overdue by 45 min — Shaft Assembly", meta: "Due 09:00 · Assigned to Line 2", icon: "🕐" },
  { id: 3, type: "warning", title: "Material shortage: Bearing 6208 (5 units remaining)", meta: "Min stock: 20 · Reorder triggered", icon: "📦" },
  { id: 4, type: "info", title: "Quality hold raised on Batch BT-0892", meta: "12 units quarantined · QC reviewing", icon: "🔍" },
]

// ===== ACTIVITY FEED =====
export const mockActivityFeed = [
  { id: 1, type: "green", icon: "✓", title: "WO-2395 Completed — Gear Housing (Qty: 50)", meta: "13:42 · Operator: Rahul M." },
  { id: 2, type: "blue", icon: "▶", title: "WO-2404 Started on CNC-01 — Shaft Assy", meta: "13:15 · Setup by: Kumar D." },
  { id: 3, type: "amber", icon: "⏸", title: "WO-2402 paused — material replenishment", meta: "12:58 · Awaiting: Bearing 6208" },
  { id: 4, type: "red", icon: "✕", title: "NCR-0041 raised — surface defect Batch BT-0892", meta: "12:30 · Reported by: Sneha P." },
  { id: 5, type: "green", icon: "✓", title: "WO-2390 Dispatched — 200 units", meta: "11:55 · Approved by: Priya S." },
  { id: 6, type: "blue", icon: "▶", title: "Shift Morning started — 18 operators logged in", meta: "06:00 · Shift supervisor: Priya S." },
]

// ===== PRODUCTION ORDERS =====
export const mockProductionOrders = [
  { id: "WO-2401", product: "Gear Housing Assy", partNo: "GH-7732-A", qty: 100, completed: 42, status: "In Progress", priority: "High", dueDate: "Sep 3, 2026", workcenter: "CNC-01", customer: "AutoVolt Ltd" },
  { id: "WO-2402", product: "Drive Shaft Sub-Assy", partNo: "DS-4418-B", qty: 50, completed: 18, status: "In Progress", priority: "Critical", dueDate: "Sep 3, 2026", workcenter: "CNC-02", customer: "PrecisionDrive Inc" },
  { id: "WO-2403", product: "Valve Body Machining", partNo: "VB-2291-C", qty: 200, completed: 120, status: "In Progress", priority: "Medium", dueDate: "Sep 4, 2026", workcenter: "VMC-01", customer: "FluidPower Co" },
  { id: "WO-2404", product: "Bracket Weldment", partNo: "BW-9901-A", qty: 80, completed: 0, status: "Queued", priority: "Medium", dueDate: "Sep 4, 2026", workcenter: "WLD-01", customer: "Internal" },
  { id: "WO-2405", product: "Precision Pin Set", partNo: "PP-1124-D", qty: 500, completed: 0, status: "Queued", priority: "Low", dueDate: "Sep 5, 2026", workcenter: "GRD-01", customer: "MicroFit GmbH" },
  { id: "WO-2406", product: "Control Panel Assy", partNo: "CP-5507-B", qty: 25, completed: 25, status: "Completed", priority: "High", dueDate: "Sep 3, 2026", workcenter: "ASM-01", customer: "AutoVolt Ltd" },
  { id: "WO-2407", product: "Hydraulic Manifold", partNo: "HM-3362-A", qty: 30, completed: 12, status: "In Progress", priority: "High", dueDate: "Sep 3, 2026", workcenter: "VMC-02", customer: "FluidPower Co" },
  { id: "WO-2408", product: "Frame Stamping", partNo: "FS-7710-C", qty: 400, completed: 220, status: "In Progress", priority: "Medium", dueDate: "Sep 5, 2026", workcenter: "TRN-01", customer: "BodyWorks AG" },
  { id: "WO-2409", product: "Cover Plate CNC", partNo: "CP-0091-A", qty: 150, completed: 150, status: "Completed", priority: "Low", dueDate: "Sep 2, 2026", workcenter: "CNC-03", customer: "Internal" },
  { id: "WO-2410", product: "Exhaust Manifold Weld", partNo: "EM-8843-B", qty: 60, completed: 28, status: "In Progress", priority: "High", dueDate: "Sep 3, 2026", workcenter: "WLD-01", customer: "AutoVolt Ltd" },
  { id: "WO-2411", product: "Sensor Housing", partNo: "SH-6618-A", qty: 75, completed: 0, status: "On Hold", priority: "Medium", dueDate: "Sep 6, 2026", workcenter: "CMM-01", customer: "SensorTech Ltd" },
  { id: "WO-2412", product: "Camshaft Assy", partNo: "CA-3391-D", qty: 40, completed: 0, status: "Released", priority: "Critical", dueDate: "Sep 4, 2026", workcenter: "CNC-01", customer: "PrecisionDrive Inc" },
]

// ===== SCHEDULING =====
export const mockSchedule = [
  { id: "WO-2401", product: "Gear Housing Assy", workcenter: "CNC-01", start: 0, duration: 6, status: "running" },
  { id: "WO-2402", product: "Drive Shaft", workcenter: "CNC-02", start: 0, duration: 8, status: "running" },
  { id: "WO-2403", product: "Valve Body", workcenter: "VMC-01", start: 0, duration: 10, status: "running" },
  { id: "WO-2407", product: "Hydraulic Manifold", workcenter: "VMC-02", start: 0, duration: 4, status: "delayed" },
  { id: "WO-2412", product: "Camshaft Assy", workcenter: "CNC-01", start: 7, duration: 5, status: "planned" },
  { id: "WO-2404", product: "Bracket Weldment", workcenter: "WLD-01", start: 2, duration: 6, status: "planned" },
  { id: "WO-2405", product: "Precision Pin Set", workcenter: "GRD-01", start: 4, duration: 8, status: "planned" },
  { id: "WO-2408", product: "Frame Stamping", workcenter: "TRN-01", start: 0, duration: 12, status: "running" },
]

// ===== CAPACITY =====
export const mockCapacity = [
  { resource: "CNC-01", available: 8, used: 7.5, utilization: 94 },
  { resource: "CNC-02", available: 8, used: 8, utilization: 100 },
  { resource: "CNC-03", available: 8, used: 0, utilization: 0 },
  { resource: "VMC-01", available: 8, used: 6, utilization: 75 },
  { resource: "VMC-02", available: 8, used: 3, utilization: 38 },
  { resource: "GRD-01", available: 8, used: 4, utilization: 50 },
  { resource: "ASM-01", available: 8, used: 7, utilization: 88 },
  { resource: "WLD-01", available: 8, used: 5.5, utilization: 69 },
  { resource: "TRN-01", available: 8, used: 8, utilization: 100 },
]

// ===== STAGING & KITTING =====
export const mockStagingOrders = [
  { orderId: "WO-2401", product: "Gear Housing Assy", totalParts: 24, staged: 24, status: "Ready", workcenter: "CNC-01", dueTime: "06:00" },
  { orderId: "WO-2402", product: "Drive Shaft Sub-Assy", totalParts: 18, staged: 15, status: "Partial", workcenter: "CNC-02", dueTime: "06:30" },
  { orderId: "WO-2403", product: "Valve Body Machining", totalParts: 8, staged: 8, status: "Ready", workcenter: "VMC-01", dueTime: "07:00" },
  { orderId: "WO-2407", product: "Hydraulic Manifold", totalParts: 22, staged: 10, status: "Partial", workcenter: "VMC-02", dueTime: "07:30" },
  { orderId: "WO-2404", product: "Bracket Weldment", totalParts: 12, staged: 0, status: "Pending", workcenter: "WLD-01", dueTime: "09:00" },
  { orderId: "WO-2412", product: "Camshaft Assy", totalParts: 30, staged: 0, status: "Pending", workcenter: "CNC-01", dueTime: "14:00" },
]

// ===== OPERATIONS & BOM =====
export const mockBOMItems = [
  { partNo: "GH-7732-A", name: "Gear Housing Assy", qty: 1, uom: "EA", type: "parent", level: 0 },
  { partNo: "GH-7732-01", name: "Housing Body (Cast Iron)", qty: 1, uom: "EA", type: "component", level: 1 },
  { partNo: "GH-7732-02", name: "Cover Plate", qty: 2, uom: "EA", type: "component", level: 1 },
  { partNo: "GH-7732-03", name: "Bearing 6208 ZZ", qty: 4, uom: "EA", type: "component", level: 1 },
  { partNo: "GH-7732-04", name: "Input Shaft", qty: 1, uom: "EA", type: "component", level: 1 },
  { partNo: "GH-7732-05", name: "Output Gear", qty: 1, uom: "EA", type: "component", level: 1 },
  { partNo: "STD-BOLT-M8", name: "M8 x 25 Bolt (SS)", qty: 12, uom: "EA", type: "fastener", level: 1 },
  { partNo: "STD-GSKT-01", name: "Oil Seal Gasket", qty: 2, uom: "EA", type: "consumable", level: 1 },
]

export const mockOperations = [
  { seq: 10, name: "Raw Material Inspection", workcenter: "INS-01", setupTime: 15, runTime: 30, status: "Completed" },
  { seq: 20, name: "Rough Machining (CNC)", workcenter: "CNC-01", setupTime: 45, runTime: 180, status: "Completed" },
  { seq: 30, name: "Semi-Finish Machining", workcenter: "CNC-01", setupTime: 20, runTime: 120, status: "In Progress" },
  { seq: 40, name: "Precision Grinding", workcenter: "GRD-01", setupTime: 30, runTime: 90, status: "Pending" },
  { seq: 50, name: "CMM Inspection", workcenter: "CMM-01", setupTime: 10, runTime: 45, status: "Pending" },
  { seq: 60, name: "Deburring & Cleaning", workcenter: "ASM-01", setupTime: 5, runTime: 30, status: "Pending" },
  { seq: 70, name: "Assembly", workcenter: "ASM-01", setupTime: 20, runTime: 60, status: "Pending" },
  { seq: 80, name: "Final Inspection & Pack", workcenter: "INS-01", setupTime: 10, runTime: 30, status: "Pending" },
]

// ===== MACHINE SETUP =====
export const mockSetupChecklist = [
  { id: 1, task: "Verify program number & revision", status: "done", by: "Kumar D.", time: "06:05" },
  { id: 2, task: "Set tool offsets (T01–T08)", status: "done", by: "Kumar D.", time: "06:12" },
  { id: 3, task: "Load & clamp fixture FX-2201", status: "done", by: "Kumar D.", time: "06:18" },
  { id: 4, task: "Set work coordinate origin (G54)", status: "done", by: "Kumar D.", time: "06:22" },
  { id: 5, task: "First article run (dry cycle)", status: "in-progress", by: "Kumar D.", time: "—" },
  { id: 6, task: "First article inspection", status: "pending", by: "—", time: "—" },
  { id: 7, task: "QC sign-off for production release", status: "pending", by: "—", time: "—" },
]

// ===== QUALITY MANAGEMENT =====
export const mockNCRs = [
  { id: "NCR-0041", orderId: "WO-2402", product: "Drive Shaft", defect: "Surface scratch", qty: 3, severity: "Minor", status: "Open", raisedBy: "Sneha P.", date: "Sep 3, 2026" },
  { id: "NCR-0040", orderId: "WO-2398", product: "Gear Housing", defect: "Dimensional out-of-tolerance", qty: 1, severity: "Major", status: "Under Review", raisedBy: "Arjun K.", date: "Sep 2, 2026" },
  { id: "NCR-0039", orderId: "WO-2395", product: "Control Panel", defect: "Label placement error", qty: 5, severity: "Minor", status: "Closed", raisedBy: "Rohit G.", date: "Sep 1, 2026" },
  { id: "NCR-0038", orderId: "WO-2390", product: "Valve Body", defect: "Porosity in casting", qty: 2, severity: "Critical", status: "Closed", raisedBy: "Meera V.", date: "Aug 31, 2026" },
  { id: "NCR-0037", orderId: "WO-2385", product: "Bracket Weldment", defect: "Weld spatter", qty: 8, severity: "Minor", status: "Closed", raisedBy: "Sneha P.", date: "Aug 30, 2026" },
]

export const mockInspectionResults = [
  { batch: "BT-0892", orderId: "WO-2402", inspected: 50, passed: 47, failed: 3, yieldRate: 94.0, inspector: "Arjun K.", date: "Sep 3, 2026" },
  { batch: "BT-0891", orderId: "WO-2401", inspected: 42, passed: 42, failed: 0, yieldRate: 100.0, inspector: "Sneha P.", date: "Sep 3, 2026" },
  { batch: "BT-0890", orderId: "WO-2395", inspected: 25, passed: 25, failed: 0, yieldRate: 100.0, inspector: "Arjun K.", date: "Sep 2, 2026" },
  { batch: "BT-0889", orderId: "WO-2390", inspected: 200, passed: 196, failed: 4, yieldRate: 98.0, inspector: "Meera V.", date: "Sep 1, 2026" },
]

// ===== TRACEABILITY =====
export const mockTraceData = {
  "SN-GH-00421": { serial: "SN-GH-00421", product: "Gear Housing Assy", partNo: "GH-7732-A", orderId: "WO-2395", batch: "BT-0888", status: "Shipped", location: "Customer — AutoVolt Ltd", manufactured: "Aug 28, 2026", operator: "Rahul M.", components: ["SN-CB-01121", "SN-OP-00882", "BT-BEAR-6208-04"] },
  "WO-2401": { serial: "WO-2401", product: "Gear Housing Assy", partNo: "GH-7732-A", orderId: "WO-2401", batch: "BT-0892", status: "In Process", location: "CNC-01", manufactured: "—", operator: "Kumar D.", components: [] },
}

// ===== OEE DATA =====
export const mockOEEData = [
  { date: "Aug 28", oee: 81.2, availability: 88, performance: 89, quality: 99.1 },
  { date: "Aug 29", oee: 79.5, availability: 85, performance: 87, quality: 98.8 },
  { date: "Aug 30", oee: 84.1, availability: 92, performance: 88, quality: 99.5 },
  { date: "Sep 1", oee: 82.7, availability: 90, performance: 89, quality: 98.6 },
  { date: "Sep 2", oee: 85.3, availability: 93, performance: 88, quality: 99.2 },
  { date: "Sep 3", oee: 83.4, availability: 91, performance: 88, quality: 98.7 },
]

export const mockDowntime = [
  { reason: "Planned Maintenance", minutes: 45, percent: 40 },
  { reason: "Unplanned Breakdown", minutes: 30, percent: 27 },
  { reason: "Changeover", minutes: 20, percent: 18 },
  { reason: "Material Shortage", minutes: 10, percent: 9 },
  { reason: "Quality Hold", minutes: 7, percent: 6 },
]

// ===== OPERATION HANDOFF =====
export const mockHandoffs = [
  {
    id: 1, from: "Night Shift (S3)", to: "Morning Shift (S1)", date: "Sep 3, 2026",
    supervisor: "Vikram A.", status: "Received",
    completedOrders: ["WO-2394", "WO-2392", "WO-2388"],
    inProgressOrders: ["WO-2401", "WO-2402"],
    issues: "VMC-02 intermittent spindle vibration — escalated to maintenance at 05:30.",
    notes: "Material for WO-2407 pending. Forklift 2 has flat tyre — using Forklift 1 only.",
    materialShortages: ["Bearing 6208 (5 units left)", "M8 bolts SS (12 units left)"],
  },
]

// ===== INVENTORY =====
export const mockInventory = [
  { partNo: "BRG-6208", name: "Bearing 6208 ZZ", category: "Bearings", onHand: 5, minStock: 20, maxStock: 100, uom: "EA", location: "Bin A-04", status: "Critical" },
  { partNo: "BLT-M8-25", name: "M8 x 25 Bolt SS", category: "Fasteners", onHand: 12, minStock: 50, maxStock: 500, uom: "EA", location: "Bin B-12", status: "Low" },
  { partNo: "GSKT-OIL-01", name: "Oil Seal Gasket", category: "Seals", onHand: 48, minStock: 20, maxStock: 200, uom: "EA", location: "Bin C-07", status: "OK" },
  { partNo: "CI-CAST-GH", name: "CI Casting — Housing", category: "Raw Material", onHand: 24, minStock: 10, maxStock: 50, uom: "EA", location: "RM Store 2", status: "OK" },
  { partNo: "STL-BAR-25", name: "25mm Dia MS Bar", category: "Raw Material", onHand: 18, minStock: 10, maxStock: 100, uom: "M", location: "RM Store 1", status: "OK" },
  { partNo: "WELD-WIRE-08", name: "0.8mm MIG Welding Wire", category: "Consumables", onHand: 4, minStock: 10, maxStock: 50, uom: "KG", location: "Consumables", status: "Low" },
  { partNo: "CUT-INS-CNMG", name: "CNMG Carbide Insert", category: "Tooling", onHand: 32, minStock: 20, maxStock: 80, uom: "EA", location: "Tool Store", status: "OK" },
  { partNo: "CUT-INS-APMT", name: "APMT Face Mill Insert", category: "Tooling", onHand: 8, minStock: 10, maxStock: 40, uom: "EA", location: "Tool Store", status: "Low" },
]

// ===== BACKFLUSH / CLOSEOUT =====
export const mockBackflush = [
  { orderId: "WO-2395", product: "Gear Housing Assy", batch: "BT-0888", qty: 50, status: "Backflushed", date: "Aug 28, 2026" },
  { orderId: "WO-2392", product: "Control Panel", batch: "BT-0886", qty: 25, status: "Backflushed", date: "Aug 27, 2026" },
  { orderId: "WO-2406", product: "Control Panel Assy", batch: "BT-0891", qty: 25, status: "Ready for Dispatch", date: "Sep 3, 2026" },
  { orderId: "WO-2409", product: "Cover Plate CNC", batch: "BT-0893", qty: 150, status: "Ready for Dispatch", date: "Sep 3, 2026" },
]

export const mockDispatch = [
  { id: "DSP-0201", orderId: "WO-2406", product: "Control Panel Assy", customer: "AutoVolt Ltd", qty: 25, status: "Ready", scheduledDate: "Sep 3, 2026" },
  { id: "DSP-0202", orderId: "WO-2409", product: "Cover Plate CNC", customer: "Internal", qty: 150, status: "Ready", scheduledDate: "Sep 3, 2026" },
  { id: "DSP-0200", orderId: "WO-2395", product: "Gear Housing Assy", customer: "AutoVolt Ltd", qty: 50, status: "Dispatched", scheduledDate: "Aug 28, 2026" },
]

// ===== LIVE MONITORING =====
export const mockLiveStats = {
  totalMachines: 12,
  running: 7,
  idle: 2,
  down: 1,
  setup: 1,
  maintenance: 1,
}
