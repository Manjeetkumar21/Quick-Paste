import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from "./components/Dashboard"
import ViewPaste from "./components/ViewPaste"
import { Toaster } from "./components/ui/toaster"

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/:id" element={<ViewPaste />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  )
}

export default App
