import { useState, useEffect } from 'react'
import { Calendar, Clock, CheckCircle, XCircle, Loader, Leaf, User, Stethoscope, AlertCircle } from 'lucide-react'
import { doctorAPI } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const STATUS_COLORS = {
  pending:   { bg: '#FEF3C7', text: '#D97706' },
  confirmed: { bg: '#E8EDE0', text: '#4A5E3A' },
  completed: { bg: '#D1FAE5', text: '#065F46' },
  cancelled: { bg: '#FEE2E2', text: '#EF4444' },
}

const STATUS_ACTIONS = {
  pending:   ['confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
}

export default function DoctorDashboard() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [therapist, setTherapist]       = useState(null)
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [updatingId, setUpdatingId]     = useState(null)
  const [filter, setFilter]             = useState('all')

  // Role guard
  useEffect(() => {
    if (!isAuthenticated) { navigate('/'); return }
    if (user?.role !== 'doctor' && user?.role !== 'admin') { navigate('/'); return }
  }, [isAuthenticated, user, navigate])

  useEffect(() => {
    if (!user) return
    doctorAPI.getMySchedule()
      .then(r => {
        setAppointments(r.data.data?.appointments || [])
        setTherapist(r.data.data?.therapist || null)
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Could not load schedule.')
      })
      .finally(() => setLoading(false))
  }, [user])

  const handleStatus = async (id, status) => {
    setUpdatingId(id)
    try {
      await doctorAPI.updateAppointmentStatus(id, status)
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    } catch {}
    setUpdatingId(null)
  }

  const filtered = filter === 'all'
    ? appointments
    : appointments.filter(a => a.status === filter)

  // Stats
  const stats = {
    total:     appointments.length,
    pending:   appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  }

  if (!isAuthenticated || (user?.role !== 'doctor' && user?.role !== 'admin')) return null

  return (
    <div className="min-h-screen" style={{ background: '#F7F4EF' }}>
      {/* Header */}
      <div className="py-12 px-4" style={{ background: 'linear-gradient(135deg, #2C3E1E, #4A5E3A)' }}>
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
            style={{ background: 'rgba(255,255,255,0.15)' }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <p className="text-white/60 text-sm">Doctor Dashboard</p>
            <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
            {therapist && (
              <p className="text-white/70 text-sm mt-0.5">
                <Stethoscope className="inline w-3.5 h-3.5 mr-1" />
                {therapist.specialization}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">

        {/* No therapist profile warning */}
        {!loading && error && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: '#D97706' }} />
            <div>
              <p className="font-semibold text-sm" style={{ color: '#92400E' }}>Therapist Profile Not Linked</p>
              <p className="text-xs text-amber-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Calendar,     label: 'Total Sessions',  value: stats.total,     color: '#6B7F5E' },
            { icon: Clock,        label: 'Pending',         value: stats.pending,   color: '#D97706' },
            { icon: CheckCircle,  label: 'Confirmed',       value: stats.confirmed, color: '#4A5E3A' },
            { icon: CheckCircle,  label: 'Completed',       value: stats.completed, color: '#065F46' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border p-5" style={{ borderColor: '#E8EDE0' }}>
              <s.icon className="w-5 h-5 mb-2" style={{ color: s.color }} />
              <div className="text-2xl font-bold mb-0.5" style={{ color: '#2C3E1E' }}>
                {loading ? '—' : s.value}
              </div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                filter === f ? 'text-white' : 'text-gray-500 hover:bg-[#E8EDE0]'
              }`}
              style={filter === f ? { background: '#4A5E3A' } : {}}>
              {f === 'all' ? `All (${appointments.length})` : `${f} (${appointments.filter(a => a.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Appointments list */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader className="w-7 h-7 animate-spin" style={{ color: '#6B7F5E' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border p-14 text-center" style={{ borderColor: '#E8EDE0' }}>
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-25" style={{ color: '#6B7F5E' }} />
            <p className="text-gray-400 font-medium">No {filter !== 'all' ? filter : ''} appointments found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((a, i) => {
              const sc = STATUS_COLORS[a.status] || STATUS_COLORS.pending
              const actions = STATUS_ACTIONS[a.status] || []
              return (
                <div key={a.id || i}
                  className="bg-white rounded-2xl border p-5 flex flex-wrap items-center gap-4"
                  style={{ borderColor: '#E8EDE0' }}>
                  {/* Patient avatar */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ background: 'linear-gradient(135deg, #4A5E3A, #8A9E6C)' }}>
                    {(a.user?.name || 'P').charAt(0).toUpperCase()}
                  </div>

                  {/* Patient info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: '#2C3E1E' }}>
                      {a.user?.name || 'Patient'}
                    </p>
                    <p className="text-xs text-gray-400">{a.user?.email}</p>
                  </div>

                  {/* Date & time */}
                  <div className="text-right text-xs text-gray-500 shrink-0">
                    <p className="font-medium">
                      {new Date(a.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p>{a.time}</p>
                  </div>

                  {/* Status badge */}
                  <span className="text-xs font-semibold px-3 py-1 rounded-full capitalize shrink-0"
                    style={{ background: sc.bg, color: sc.text }}>
                    {a.status}
                  </span>

                  {/* Action buttons */}
                  {actions.length > 0 && (
                    <div className="flex gap-2">
                      {actions.map(s => (
                        <button key={s} onClick={() => handleStatus(a.id, s)}
                          disabled={updatingId === a.id}
                          className="text-xs px-3 py-1.5 rounded-full border font-medium transition-colors hover:opacity-80 capitalize"
                          style={{
                            borderColor: STATUS_COLORS[s]?.text || '#6B7F5E',
                            color:       STATUS_COLORS[s]?.text || '#6B7F5E',
                          }}>
                          {updatingId === a.id ? '...' : `Mark ${s}`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
