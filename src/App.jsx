import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom"
import Login from "./pages/login"
import Signup from "./pages/signup"
import OTP from "./pages/OTP"
import Dashboard from "./pages/dashboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App