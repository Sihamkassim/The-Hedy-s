import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import TherapistsPage from './pages/TherapistsPage'
import BookingPage from './pages/BookingPage'
import CheckoutPage from './pages/CheckoutPage'
import FreeHelpPage from './pages/FreeHelpPage'
import ChallengesPage from './pages/ChallengesPage'
import ChallengeDetailPage from './pages/ChallengeDetailPage'
import Dashboard from './pages/Dashboard'
import AdminPage from './pages/AdminPage'
import DoctorDashboard from './pages/DoctorDashboard'
import ChatPage from './pages/ChatPage'
import AIAssistantPage from './pages/AIAssistantPage'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/therapists" element={<TherapistsPage />} />
                <Route path="/booking/:id" element={<BookingPage />} />
                <Route path="/checkout/:appointmentId" element={<CheckoutPage />} />
                <Route path="/free-help" element={<FreeHelpPage />} />
                <Route path="/challenges" element={<ChallengesPage />} />
                <Route path="/challenges/:id" element={<ChallengeDetailPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/ai-assistant" element={<AIAssistantPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/doctor" element={<DoctorDashboard />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
