import { useState, useEffect } from "react"
import { Calendar, CheckCircle, XCircle, Clock, Leaf, TrendingUp, Loader, Plus } from "lucide-react"
import { appointmentAPI, challengeAPI } from "../api/services"
import { useAuth } from "../context/AuthContext"
import AuthModal from "../components/AuthModal"

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [myProgress, setMyProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [cancellingId, setCancellingId] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return
    setCancellingId(id)
    try {
      await appointmentAPI.cancel(id)
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a))
    } catch {}
    setCancellingId(null)
  }

  const handleUpdateProgress = async (progressItem) => {
    setUpdatingId(progressItem.id)
    try {
      // Just hit the endpoint, it auto-increments
      const res = await challengeAPI.updateProgress(progressItem.challengeId || progressItem.id, {})
      const updatedProg = res.data.data.progress
      setMyProgress(prev => prev.map(p => p.id === progressItem.id ? updatedProg : p))
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update progress')
    }
    setUpdatingId(null)
  }

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return }
    Promise.all([
      appointmentAPI.getMyAppointments().then(r => setAppointments(r.data.data.appointments)).catch(() => {}),
      challengeAPI.getMyProgress().then(r => setMyProgress(r.data.data.progress)).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [isAuthenticated])

  const statusColor = { pending: "#F59E0B", confirmed: "#6B7F5E", completed: "#8A9E6C", cancelled: "#EF4444" }
  const statusBg = { pending: "#FEF3C7", confirmed: "#E8EDE0", completed: "#E8EDE0", cancelled: "#FEE2E2" }

  if (!isAuthenticated) return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#F7F4EF" }}>
        <Leaf className="w-12 h-12 mb-4 opacity-30" style={{ color: "#4A5E3A" }} />
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#2C3E1E" }}>Sign in to view your dashboard</h2>
        <p className="text-gray-500 text-sm mb-6">Track your appointments, challenges and progress all in one place.</p>
        <button onClick={() => setShowAuth(true)} className="px-7 py-3 rounded-full font-semibold text-white text-sm" style={{ background: "linear-gradient(135deg, #4A5E3A, #6B7F5E)" }}>
          Sign In
        </button>
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )

  return (
    <div className="min-h-screen" style={{ background: "#F7F4EF" }}>
      {/* Header */}
      <div className="py-12 px-4" style={{ background: "linear-gradient(135deg, #2C3E1E, #4A5E3A)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold" style={{ background: "rgba(255,255,255,0.15)" }}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="text-white/70 text-sm">Welcome back,</p>
              <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Calendar, label: "Total Appointments", value: appointments.length },
            { icon: CheckCircle, label: "Completed", value: appointments.filter(a => a.status === "completed").length },
            { icon: Clock, label: "Upcoming", value: appointments.filter(a => a.status === "confirmed" || a.status === "pending").length },
            { icon: TrendingUp, label: "Challenges Active", value: myProgress.length },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E8EDE0" }}>
              <s.icon className="w-5 h-5 mb-2" style={{ color: "#6B7F5E" }} />
              <div className="text-2xl font-bold mb-0.5" style={{ color: "#2C3E1E" }}>{loading ? "—" : s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Appointments */}
        <div>
          <h2 className="text-lg font-bold mb-4" style={{ color: "#2C3E1E" }}>My Appointments</h2>
          {loading ? (
            <div className="flex justify-center py-12"><Loader className="w-6 h-6 animate-spin" style={{ color: "#6B7F5E" }} /></div>
          ) : appointments.length === 0 ? (
            <div className="bg-white rounded-2xl border p-10 text-center" style={{ borderColor: "#E8EDE0" }}>
              <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: "#6B7F5E" }} />
              <p className="text-gray-500 text-sm">No appointments yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((a, i) => (
                <div key={a.id || i} className="bg-white rounded-2xl border p-5 flex items-center justify-between gap-4" style={{ borderColor: "#E8EDE0" }}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, #4A5E3A, #8A9E6C)" }}>
                      {(a.therapist?.name || "T").charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "#2C3E1E" }}>{a.therapist?.name || "Therapist"}</p>
                      <p className="text-xs text-gray-400">{a.therapist?.specialization}</p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <p>{new Date(a.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p>
                    <p>{a.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full capitalize"
                      style={{ background: statusBg[a.status] || "#E8EDE0", color: statusColor[a.status] || "#6B7F5E" }}>
                      {a.status}
                    </span>
                    {(a.status === 'pending' || a.status === 'confirmed') && (
                      <button
                        onClick={() => handleCancel(a.id)}
                        disabled={cancellingId === a.id}
                        className="text-xs px-3 py-1 rounded-full border transition-colors hover:bg-red-50"
                        style={{ borderColor: '#EF4444', color: '#EF4444' }}>
                        {cancellingId === a.id ? '...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Challenge Progress */}
        <div>
          <h2 className="text-lg font-bold mb-4" style={{ color: "#2C3E1E" }}>Challenge Progress</h2>
          {loading ? (
            <div className="flex justify-center py-8"><Loader className="w-6 h-6 animate-spin" style={{ color: "#6B7F5E" }} /></div>
          ) : myProgress.length === 0 ? (
            <div className="bg-white rounded-2xl border p-10 text-center" style={{ borderColor: "#E8EDE0" }}>
              <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: "#6B7F5E" }} />
              <p className="text-gray-500 text-sm">No challenges joined yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {myProgress.map((p, i) => (
                <div key={p.id || i} className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E8EDE0" }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-sm" style={{ color: "#2C3E1E" }}>{p.challenge?.title || "Challenge"}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{p.completedDays} / {p.challenge?.duration} days</p>
                    </div>
                    <span className="text-sm font-bold" style={{ color: "#6B7F5E" }}>{Math.round(p.progress || 0)}%</span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ background: "#E8EDE0" }}>
                    <div className="h-2 rounded-full transition-all" style={{ width: `${p.progress || 0}%`, background: "linear-gradient(90deg, #4A5E3A, #8A9E6C)" }} />
                  </div>
                  {(p.progress || 0) < 100 && (
                    <button
                      onClick={() => handleUpdateProgress(p)}
                      disabled={updatingId === p.id}
                      className="mt-3 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
                      style={{ background: '#E8EDE0', color: '#4A5E3A' }}>
                      <Plus className="w-3 h-3" />
                      {updatingId === p.id ? 'Saving...' : 'Log Today'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
