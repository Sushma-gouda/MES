import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

// Auth
import Login from "./pages/login"
import Signup from "./pages/signup"
import OTP from "./pages/otp"

// Layout
import AppShell from "./components/layout/AppShell"
import ProtectedRoute from "./components/auth/ProtectedRoute"

// Public pages
import LandingPage from "./pages/LandingPage"

// App pages
import Dashboard from "./pages/dashboard/Dashboard"
import ProductionOrders from "./pages/production/ProductionOrders"
import PlanningScheduling from "./pages/production/PlanningScheduling"
import CapacityPlanning from "./pages/production/CapacityPlanning"
import DispatchToMES from "./pages/production/DispatchToMES"
import StagingKitting from "./pages/execute/StagingKitting"
import OperationsBOM from "./pages/execute/OperationsBOM"
import MachineSetup from "./pages/execute/MachineSetup"
import ProductionExecution from "./pages/execute/ProductionExecution"
import LiveMonitoring from "./pages/monitor/LiveMonitoring"
import QualityManagement from "./pages/monitor/QualityManagement"
import Traceability from "./pages/monitor/Traceability"
import OEEMonitoring from "./pages/monitor/OEEMonitoring"
import OperationHandoff from "./pages/monitor/OperationHandoff"
import InventoryBackflush from "./pages/dispatch/InventoryBackflush"
import CloseoutDispatch from "./pages/dispatch/CloseoutDispatch"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp" element={<OTP />} />

        {/* Protected authenticated routes — wrapped in AppShell */}
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Plan & Release */}
          <Route path="/production-orders" element={<ProductionOrders />} />
          <Route path="/planning" element={<PlanningScheduling />} />
          <Route path="/capacity" element={<CapacityPlanning />} />
          <Route path="/mes-dispatch" element={<DispatchToMES />} />

          {/* Execute */}
          <Route path="/staging" element={<StagingKitting />} />
          <Route path="/operations" element={<OperationsBOM />} />
          <Route path="/machine-setup" element={<MachineSetup />} />
          <Route path="/execution" element={<ProductionExecution />} />

          {/* Assure & Track */}
          <Route path="/monitoring" element={<LiveMonitoring />} />
          <Route path="/quality" element={<QualityManagement />} />
          <Route path="/traceability" element={<Traceability />} />
          <Route path="/oee" element={<OEEMonitoring />} />
          <Route path="/handoff" element={<OperationHandoff />} />

          {/* Close & Dispatch */}
          <Route path="/inventory" element={<InventoryBackflush />} />
          <Route path="/dispatch" element={<CloseoutDispatch />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App