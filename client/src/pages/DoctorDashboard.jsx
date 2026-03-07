import { useState, useEffect } from 'react'
import { Calendar, Clock, CheckCircle, XCircle, Loader, Leaf, User, Stethoscope, AlertCircle, Plus, X, Trash2, BookOpen } from 'lucide-react'
import { doctorAPI, challengeAPI, therapistAPI } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const STATUS_COLORS = {
  pending:   { bg: '#FEF3C7', text: '#D97706' },
  paid:      { bg: '#DBEAFE', text: '#2563EB' },
  confirmed: { bg: 'color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)', text: 'var(--primary)' },
  completed: { bg: '#D1FAE5', text: '#065F46' },
  cancelled: { bg: '#FEE2E2', text: '#EF4444' },
}

const STATUS_ACTIONS = {
  pending:   ['confirmed', 'cancelled'],
  paid:      ['confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
}

export default function DoctorDashboard() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [challenges, setChallenges]     = useState([])
  const [therapist, setTherapist]       = useState(null)
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [updatingId, setUpdatingId]     = useState(null)
  const [deletingId, setDeletingId]     = useState(null)
  const [filter, setFilter]             = useState('all')
  const [activeView, setActiveView]     = useState('appointments') // 'appointments' or 'challenges'

  const [showAddChallenge, setShowAddChallenge] = useState(false)
  const [challengeForm, setChallengeForm] = useState({ title: '', description: '', duration: '', isRepetitive: true, dailyTasks: [] })
  const [challengeError, setChallengeError] = useState('')
  const [addingChallenge, setAddingChallenge] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [termsSubmitting, setTermsSubmitting] = useState(false)
  const [termsError, setTermsError] = useState('')

  // Role guard
  useEffect(() => {
    if (!isAuthenticated) { navigate('/'); return }
    if (user?.role !== 'doctor' && user?.role !== 'admin' && user?.role !== 'spiritual_leader') { navigate('/'); return }
  }, [isAuthenticated, user, navigate])

  useEffect(() => {
    if (!user) return
    Promise.all([
      doctorAPI.getMySchedule(),
      challengeAPI.getAll()
    ])
      .then(([docRes, chalRes]) => {
        setAppointments(docRes.data.data?.appointments || [])
        // Could be a therapist or spiritual leader
        const tProfile = docRes.data.data?.therapist || docRes.data.data?.spirtualLeader || docRes.data.data?.spiritualLeader
        setTherapist(tProfile || null)
        if (tProfile && tProfile.status === 'approved' && !tProfile.termsAccepted) {
          setShowTerms(true)
        }
        setChallenges(chalRes.data.data?.challenges || chalRes.data.data || [])
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Could not load data.')
      })
      .finally(() => setLoading(false))
  }, [user])

  const handleAcceptTerms = async () => {
    if (!termsAccepted || termsSubmitting) return
    setTermsError('')
    setTermsSubmitting(true)
    try {
      await therapistAPI.acceptTerms()
      setShowTerms(false)
      setTherapist(prev => (prev ? { ...prev, termsAccepted: true } : prev))
    } catch (err) {
      setTermsError(err.response?.data?.message || 'Failed to accept terms. Please try again.')
    } finally {
      setTermsSubmitting(false)
    }
  }

  const handleAddChallenge = async (e) => {
    e.preventDefault(); setAddingChallenge(true); setChallengeError('')
    try {
      const payload = { ...challengeForm, duration: Number(challengeForm.duration) }
      if (!payload.isRepetitive) {
        // limit tasks to duration
        payload.dailyTasks = payload.dailyTasks.slice(0, payload.duration)
        // pad with empty strings if less
        while (payload.dailyTasks.length < payload.duration) {
          payload.dailyTasks.push('')
        }
      } else {
        payload.dailyTasks = []
      }

      const res = await challengeAPI.create(payload)
      setChallenges(prev => [res.data.data?.challenge || res.data.data, ...prev])
      setShowAddChallenge(false)
      setChallengeForm({ title: '', description: '', duration: '', isRepetitive: true, dailyTasks: [] })
    } catch (err) { setChallengeError(err.response?.data?.message || 'Failed to create challenge') }
    setAddingChallenge(false)
  }

  const handleTaskChange = (index, val) => {
    const newTasks = [...challengeForm.dailyTasks]
    newTasks[index] = val
    setChallengeForm({ ...challengeForm, dailyTasks: newTasks })
  }

  const handleDeleteChallenge = async (id) => {
    if (!window.confirm('Delete this challenge and all its progress?')) return
    setDeletingId(id)
    try { await challengeAPI.delete(id); setChallenges(prev => prev.filter(c => (c.id || c._id) !== id)) } catch {}
    setDeletingId(null)
  }

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

  if (!isAuthenticated || (user?.role !== 'doctor' && user?.role !== 'admin' && user?.role !== 'spiritual_leader')) return null

  if (therapist?.status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--base-bg)]">
        <div className="bg-base-bg p-8 rounded-3xl max-w-md w-full text-center shadow-xl border border-[#D4DBC8]">
          <Clock className="w-16 h-16 mx-auto mb-4 text-[#D97706]" />
          <h2 className="text-2xl font-bold text-[var(--base-text)] mb-2">Application Pending</h2>
          <p className="text-gray-600 mb-6">
            Your application to join HerSpace as a therapist is currently under review by our admin team.
            We will notify you once your credentials have been verified.
          </p>
        </div>
      </div>
    )
  }

  if (therapist?.status === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--base-bg)]">
        <div className="bg-base-bg p-8 rounded-3xl max-w-md w-full text-center shadow-xl border border-red-200">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold text-[var(--base-text)] mb-2">Application Rejected</h2>
          <p className="text-gray-600 mb-6">
            Unfortunately, your application to join HerSpace was not approved at this time. Please contact support for more detailed feedback regarding your documentation.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--base-bg)' }}>
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-base-bg rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[var(--base-text)] mb-4">Therapist Terms & Conditions</h2>
            <div className="text-sm text-gray-600 space-y-4 mb-6 p-4 bg-[var(--base-bg)] rounded-xl border border-[#D4DBC8]">
              <p><strong>1. Professional Conduct:</strong> As a verified therapist on HerSpace, you agree to uphold the highest standard of professional ethics and confidentiality regarding patient data and conversations.</p>
              <p><strong>2. Accuracy of Diagnosis:</strong> Any advice, diagnosis, or health information you provide must fall strictly within your certified areas of expertise.</p>
              <p><strong>3. Emergency Protocols:</strong> If a user expresses intent for self-harm or harm to others, you are obligated to refer them strictly to emergency hotlines and follow standard psychiatric emergency procedures immediately.</p>
              <p><strong>4. Verification Accuracy:</strong> By accepting you reaffirm that all documents uploaded during registration are authentic, unedited, and legally bind you to practice.</p>
            </div>
            <label className="flex items-start gap-3 mb-6 cursor-pointer">
              <input type="checkbox" className="mt-1 w-4 h-4 text-[var(--primary)] rounded border-gray-300 focus:ring-[var(--primary)]" 
                checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
              <span className="text-sm font-medium text-gray-700">I have read and agree to strictly follow the mental health and platform guidelines stated above.</span>
            </label>
            {termsError && (
              <p className="text-sm text-red-600 mb-4">{termsError}</p>
            )}
            <button onClick={handleAcceptTerms} disabled={!termsAccepted || termsSubmitting}
              className={`w-full py-3 rounded-xl font-bold text-primary-inverse transition-all ${termsAccepted ? 'bg-[var(--primary)] hover:bg-[var(--base-text)]' : 'bg-gray-300 cursor-not-allowed'}`}>
              {termsSubmitting ? 'Saving...' : 'Accept and Continue to Dashboard'}
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="py-12 px-4" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-primary-inverse text-2xl font-bold"
            style={{ background: 'rgba(255,255,255,0.15)' }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <p className="text-primary-inverse opacity-60 text-sm">{user?.role === 'spiritual_leader' ? 'Spiritual Guide Dashboard' : 'Doctor Dashboard'}</p>
            <h1 className="text-2xl font-bold text-primary-inverse">{user?.name}</h1>
            {therapist && (
              <p className="text-primary-inverse opacity-70 text-sm mt-0.5">
                <Stethoscope className="inline w-3.5 h-3.5 mr-1" />
                {therapist.specialization || therapist.religion}
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
            { icon: Calendar,     label: 'Total Sessions',  value: stats.total,     color: 'var(--primary)' },
            { icon: Clock,        label: 'Pending',         value: stats.pending,   color: '#D97706' },
            { icon: CheckCircle,  label: 'Confirmed',       value: stats.confirmed, color: 'var(--primary)' },
            { icon: CheckCircle,  label: 'Completed',       value: stats.completed, color: '#065F46' },
          ].map((s, i) => (
            <div key={i} className="bg-base-bg rounded-2xl border p-5" style={{ borderColor: 'color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)' }}>
              <s.icon className="w-5 h-5 mb-2" style={{ color: s.color }} />
              <div className="text-2xl font-bold mb-0.5" style={{ color: 'var(--base-text)' }}>
                {loading ? '—' : s.value}
              </div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* View toggles */}
        <div className="flex gap-4 border-b border-gray-200">
          <button onClick={() => setActiveView('appointments')}
            className={`pb-3 text-sm font-semibold transition-colors ${activeView === 'appointments' ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]' : 'text-gray-400 hover:text-gray-600'}`}>
            My Appointments
          </button>
          <button onClick={() => setActiveView('challenges')}
            className={`pb-3 text-sm font-semibold transition-colors ${activeView === 'challenges' ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]' : 'text-gray-400 hover:text-gray-600'}`}>
            Patient Challenges
          </button>
        </div>

        {activeView === 'appointments' && (
          <>
            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                    filter === f ? 'text-primary-inverse' : 'text-gray-500 hover:bg-[color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)]'
                  }`}
                  style={filter === f ? { background: 'var(--primary)' } : {}}>
                  {f === 'all' ? `All (${appointments.length})` : `${f} (${appointments.filter(a => a.status === f).length})`}
                </button>
              ))}
            </div>

            {/* Appointments list */}
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader className="w-7 h-7 animate-spin" style={{ color: 'var(--primary)' }} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-base-bg rounded-2xl border p-14 text-center" style={{ borderColor: 'color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)' }}>
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-25" style={{ color: 'var(--primary)' }} />
                <p className="text-gray-400 font-medium">No {filter !== 'all' ? filter : ''} appointments found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((a, i) => {
                  const sc = STATUS_COLORS[a.status] || STATUS_COLORS.pending
                  const actions = STATUS_ACTIONS[a.status] || []
                  return (
                    <div key={a.id || i}
                      className="bg-base-bg rounded-2xl border p-5 flex flex-wrap items-center gap-4"
                      style={{ borderColor: 'color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)' }}>
                      {/* Patient avatar */}
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-primary-inverse font-bold text-sm shrink-0"
                        style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
                        {(a.user?.name || 'P').charAt(0).toUpperCase()}
                      </div>

                      {/* Patient info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm" style={{ color: 'var(--base-text)' }}>
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
                                borderColor: STATUS_COLORS[s]?.text || 'var(--primary)',
                                color:       STATUS_COLORS[s]?.text || 'var(--primary)',
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
          </>
        )}

        {/* CHALLENGES VIEW */}
        {activeView === 'challenges' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--base-text)' }}>Mental Health Challenges</h2>
                <p className="text-sm text-gray-500">Create new tasks to engage your patients' daily routines.</p>
              </div>
              <button onClick={() => setShowAddChallenge(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-primary-inverse hover:shadow-md transition-all"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary))' }}>
                <Plus className="w-4 h-4" /> Add Challenge
              </button>
            </div>

            {showAddChallenge && (
              <div className="bg-base-bg rounded-2xl border p-6" style={{ borderColor: '#D4DBC8' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold" style={{ color: 'var(--base-text)' }}>New Challenge</h3>
                  <button onClick={() => setShowAddChallenge(false)} className="text-gray-400"><X className="w-4 h-4" /></button>
                </div>
                {challengeError && <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-2 mb-4">{challengeError}</div>}
                
                <form onSubmit={handleAddChallenge} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                    <input type="text" placeholder="e.g., 7 Days of Gratitude" required value={challengeForm.title}
                      onChange={e => setChallengeForm({ ...challengeForm, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--primary)] outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Duration (days)</label>
                    <input type="number" placeholder="7" required min="1" max="90" value={challengeForm.duration}
                      onChange={e => setChallengeForm({ ...challengeForm, duration: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--primary)] outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description (General)</label>
                    <textarea rows="3" placeholder="Describe the overview..." required value={challengeForm.description}
                      onChange={e => setChallengeForm({ ...challengeForm, description: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--primary)] outline-none text-sm resize-none" />
                  </div>

                  <div className="flex items-center gap-3 py-2 border-y border-gray-100">
                    <input type="checkbox" id="isRepetitive" checked={challengeForm.isRepetitive}
                      onChange={e => setChallengeForm({ ...challengeForm, isRepetitive: e.target.checked })} 
                      className="w-4 h-4 accent-[var(--primary)]" />
                    <label htmlFor="isRepetitive" className="text-sm">Tasks are repetitive (same daily task)</label>
                  </div>

                  {!challengeForm.isRepetitive && challengeForm.duration > 0 && Array.from({ length: Math.min(challengeForm.duration, 90) }).map((_, i) => (
                    <div key={i}>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 mt-2">Day {i + 1} Task</label>
                      <input type="text" placeholder={`Task for day ${i + 1}`} required 
                        value={challengeForm.dailyTasks[i] || ''}
                        onChange={e => handleTaskChange(i, e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--primary)] outline-none text-sm" />
                    </div>
                  ))}

                  <div className="flex gap-3 pt-2 mt-4">
                    <button type="submit" disabled={addingChallenge} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-primary-inverse flex items-center gap-2"
                      style={{ background: addingChallenge ? 'var(--secondary)' : 'var(--primary)' }}>
                      {addingChallenge ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      {addingChallenge ? 'Creating...' : 'Create Challenge'}
                    </button>
                    <button type="button" onClick={() => setShowAddChallenge(false)} className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-500 border border-gray-200">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-16"><Loader className="w-7 h-7 animate-spin" style={{ color: 'var(--primary)' }} /></div>
            ) : challenges.length === 0 ? (
              <div className="bg-base-bg rounded-2xl border p-12 text-center" style={{ borderColor: 'color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)' }}>
                <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: 'var(--primary)' }} />
                <p className="text-gray-400 text-sm">No challenges available.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {challenges.map((c, i) => (
                  <div key={c.id || c._id || i} className="bg-base-bg rounded-2xl border p-5 group transition-shadow hover:shadow-sm" style={{ borderColor: 'color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)' }}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold" style={{ color: 'var(--base-text)' }}>{c.title}</h4>
                      <button onClick={() => handleDeleteChallenge(c.id || c._id)} disabled={deletingId === (c.id || c._id)}
                        className="text-red-400 hover:text-red-500 transition-colors bg-red-50 p-1.5 rounded-lg opacity-0 group-hover:opacity-100">
                        {deletingId === (c.id || c._id) ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--primary)' }}>{c.duration} Days</p>
                    <p className="text-sm text-gray-500 line-clamp-2">{c.description}</p>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                      <span>{(c._count?.progress) || c.participantsCount || 0} participants</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
