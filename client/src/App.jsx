import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import TherapistsPage from './pages/TherapistsPage'
import BookingPage from './pages/BookingPage'
import FreeHelpPage from './pages/FreeHelpPage'
import ChallengesPage from './pages/ChallengesPage'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/therapists" element={<TherapistsPage />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/free-help" element={<FreeHelpPage />} />
            <Route path="/challenges" element={<ChallengesPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
