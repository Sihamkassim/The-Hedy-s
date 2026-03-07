import { useState, useEffect } from 'react'
import {
  Users, Calendar, ShieldCheck, Trash2, CheckCircle, Loader,
  Plus, X, Phone, BookOpen, BarChart3, TrendingUp, UserCheck,
  Edit3,
} from 'lucide-react'
import { appointmentAPI, therapistAPI, supportAPI, challengeAPI, adminAPI } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const TABS = [
  { id: 'stats',        label: 'Overview',     icon: BarChart3,   adminOnly: true },
  { id: 'users',        label: 'Users',        icon: Users,       adminOnly: true },
  { id: 'appointments', label: 'Appointments', icon: Calendar,    adminOnly: false },
  { id: 'therapists',   label: 'Therapists',   icon: UserCheck,   adminOnly: true },
  { id: 'challenges',   label: 'Challenges',   icon: BookOpen,    adminOnly: true },
  { id: 'resources',    label: 'Resources',    icon: Phone,       adminOnly: true },
]

const STATUS_COLORS = {
  pending:   { bg: '#FEF3C7', text: '#D97706' },
  confirmed: { bg: '#E8EDE0', text: '#4A5E3A' },
  completed: { bg: '#D1FAE5', text: '#065F46' },
  cancelled: { bg: '#FEE2E2', text: '#EF4444' },
}

const ROLE_COLORS = {
  patient: { bg: '#EDE9FE', text: '#6D28D9' },
  doctor:  { bg: '#E8EDE0', text: '#4A5E3A' },
  admin:   { bg: '#FEF3C7', text: '#D97706' },
}

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#E8EDE0' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#E8EDE0' }}>
          <Icon className="w-5 h-5" style={{ color: color || '#4A5E3A' }} />
        </div>
        {sub && <span className="text-xs text-gray-400">{sub}</span>}
      </div>
      <div className="text-3xl font-bold mb-1" style={{ color: '#2C3E1E' }}>{value ?? 'â€”'}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  )
}

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('stats')

  // Data state
  const [stats,        setStats]        = useState(null)
  const [users,        setUsers]        = useState([])
  const [appointments, setAppointments] = useState([])
  const [therapists,   setTherapists]   = useState([])
  const [challenges,   setChallenges]   = useState([])
  const [resources,    setResources]    = useState([])
  const [loading,      setLoading]      = useState(false)

  // Action state
  const [updatingId,   setUpdatingId]   = useState(null)
  const [deletingId,   setDeletingId]   = useState(null)
  const [editingRole,  setEditingRole]  = useState(null)

  // Forms
  const [showAddTherapist, setShowAddTherapist] = useState(false)
  const [therapistForm, setTherapistForm] = useState({ name: '', email: '', specialization: '', experience: '', sessionPrice: '', bio: '', isFreeSupport: false })
  const [therapistError, setTherapistError] = useState('')
  const [addingTherapist, setAddingTherapist] = useState(false)

  const [showAddChallenge, setShowAddChallenge] = useState(false)
  const [challengeForm, setChallengeForm] = useState({ title: '', description: '', duration: '' })
  const [challengeError, setChallengeError] = useState('')
  const [addingChallenge, setAddingChallenge] = useState(false)

  const [showAddResource, setShowAddResource] = useState(false)
  const [resourceForm, setResourceForm] = useState({ name: '', phone: '', category: 'Crisis' })
  const [resourceError, setResourceError] = useState('')
  const [addingResource, setAddingResource] = useState(false)

  // Role guard
  useEffect(() => {
    if (!isAuthenticated) { navigate('/'); return }
    if (user?.role !== 'admin' && user?.role !== 'doctor') { navigate('/'); return }
    if (user?.role === 'doctor') setTab('appointments')
  }, [isAuthenticated, user, navigate])

  // Load data on tab switch
  useEffect(() => {
    if (!user) return
    setLoading(true)
    const loaders = {
      stats:        () => adminAPI.getStats().then(r => setStats(r.data.data?.stats)),
      users:        () => adminAPI.getAllUsers().then(r => setUsers(r.data.data?.users || [])),
      appointments: () => appointmentAPI.getAll().then(r => setAppointments(r.data.data?.appointments || r.data.data || [])),
      therapists:   () => therapistAPI.getAll().then(r => setTherapists(r.data.data?.therapists || r.data.data || [])),
      challenges:   () => challengeAPI.getAll().then(r => setChallenges(r.data.data?.challenges || r.data.data || [])),
      resources:    () => supportAPI.getAll().then(r => setResources(r.data.data?.resources || r.data.data || [])),
    }
    loaders[tab]?.().catch(() => {}).finally(() => setLoading(false))
  }, [tab, user])

  const handleStatusUpdate = async (id, status) => {
    setUpdatingId(id)
    try {
      await appointmentAPI.updateStatus(id, status)
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    } catch {}
    setUpdatingId(null)
  }

  const handleDeleteTherapist = async (id) => {
    if (!window.confirm('Delete this therapist permanently?')) return
    setDeletingId(id)
    try { await therapistAPI.delete(id); setTherapists(prev => prev.filter(t => (t.id || t._id) !== id)) } catch {}
    setDeletingId(null)
  }

  const handleAddTherapist = async (e) => {
    e.preventDefault(); setAddingTherapist(true); setTherapistError('')
    try {
      const res = await therapistAPI.create({ ...therapistForm, experience: Number(therapistForm.experience), sessionPrice: Number(therapistForm.sessionPrice) })
      setTherapists(prev => [res.data.data?.therapist || res.data.data, ...prev])
      setShowAddTherapist(false)
      setTherapistForm({ name: '', email: '', specialization: '', experience: '', sessionPrice: '', bio: '', isFreeSupport: false })
    } catch (err) { setTherapistError(err.response?.data?.message || 'Failed to create therapist') }
    setAddingTherapist(false)
  }

  const handleAddChallenge = async (e) => {
    e.preventDefault(); setAddingChallenge(true); setChallengeError('')
    try {
      const res = await challengeAPI.create({ ...challengeForm, duration: Number(challengeForm.duration) })
      setChallenges(prev => [res.data.data?.challenge || res.data.data, ...prev])
      setShowAddChallenge(false)
      setChallengeForm({ title: '', description: '', duration: '' })
    } catch (err) { setChallengeError(err.response?.data?.message || 'Failed to create challenge') }
    setAddingChallenge(false)
  }

  const handleDeleteChallenge = async (id) => {
    if (!window.confirm('Delete this challenge and all its progress?')) return
    setDeletingId(id)
    try { await challengeAPI.delete(id); setChallenges(prev => prev.filter(c => (c.id || c._id) !== id)) } catch {}
    setDeletingId(null)
  }

  const handleAddResource = async (e) => {
    e.preventDefault(); setAddingResource(true); setResourceError('')
    try {
      const res = await supportAPI.create(resourceForm)
      setResources(prev => [res.data.data?.resource || res.data.data, ...prev])
      setShowAddResource(false)
      setResourceForm({ name: '', phone: '', category: 'Crisis' })
    } catch (err) { setResourceError(err.response?.data?.message || 'Failed to create resource') }
    setAddingResource(false)
  }

  const handleDeleteResource = async (id) => {
    if (!window.confirm('Delete this resource?')) return
    setDeletingId(id)
    try { await supportAPI.delete(id); setResources(prev => prev.filter(r => (r.id || r._id) !== id)) } catch {}
    setDeletingId(null)
  }

  const handleRoleUpdate = async (id, role) => {
    setUpdatingId(id)
    try {
      await adminAPI.updateUserRole(id, role)
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u))
    } catch {}
    setUpdatingId(null); setEditingRole(null)
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user account permanently?')) return
    setDeletingId(id)
    try { await adminAPI.deleteUser(id); setUsers(prev => prev.filter(u => u.id !== id)) } catch {}
    setDeletingId(null)
  }

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'doctor')) return null

  const visibleTabs = TABS.filter(t => !t.adminOnly || user?.role === 'admin')

  return (
    <div className="min-h-screen" style={{ background: '#F7F4EF' }}>
      {/* Header */}
      <div className="py-10 px-4" style={{ background: 'linear-gradient(135deg, #2C3E1E, #4A5E3A)' }}>
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white/60 text-sm capitalize">{user?.role} Panel</p>
            <h1 className="text-2xl font-bold text-white">Management Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b overflow-x-auto" style={{ borderColor: '#D4DBC8' }}>
          {visibleTabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap ${
                tab === t.id ? 'border-[#4A5E3A] text-[#2C3E1E]' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}>
              <t.icon className="w-4 h-4" />{t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader className="w-7 h-7 animate-spin" style={{ color: '#6B7F5E' }} />
          </div>
        ) : (
          <>
            {/* STATS */}
            {tab === 'stats' && stats && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Users</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <StatCard icon={Users}     label="Total Users"  value={stats.users?.total}    color="#4A5E3A" />
                    <StatCard icon={Users}     label="Patients"     value={stats.users?.patients} color="#6B7F5E" />
                    <StatCard icon={UserCheck} label="Doctors"      value={stats.users?.doctors}  color="#8A9E6C" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Appointments</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard icon={Calendar}    label="Total"     value={stats.appointments?.total}     color="#4A5E3A" />
                    <StatCard icon={Calendar}    label="Pending"   value={stats.appointments?.pending}   color="#D97706" />
                    <StatCard icon={CheckCircle} label="Confirmed" value={stats.appointments?.confirmed} color="#4A5E3A" />
                    <StatCard icon={CheckCircle} label="Completed" value={stats.appointments?.completed} color="#065F46" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Platform</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard icon={UserCheck}  label="Therapists"        value={stats.therapists}             color="#4A5E3A" />
                    <StatCard icon={BookOpen}   label="Challenges"        value={stats.challenges?.total}      color="#6B7F5E" />
                    <StatCard icon={TrendingUp} label="Challenge Joins"   value={stats.challenges?.totalJoins} color="#8A9E6C" />
                    <StatCard icon={Phone}      label="Support Resources" value={stats.resources}              color="#C17A55" />
                  </div>
                </div>
              </div>
            )}

            {/* USERS */}
            {tab === 'users' && (
              <div>
                <p className="text-sm text-gray-400 mb-4">{users.length} registered users</p>
                {users.length === 0 ? (
                  <div className="bg-white rounded-2xl border p-12 text-center" style={{ borderColor: '#E8EDE0' }}>
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: '#6B7F5E' }} />
                    <p className="text-gray-400 text-sm">No users yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {users.map((u, i) => {
                      const rc = ROLE_COLORS[u.role] || ROLE_COLORS.patient
                      return (
                        <div key={u.id || i} className="bg-white rounded-2xl border p-5 flex flex-wrap items-center gap-4" style={{ borderColor: '#E8EDE0' }}>
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                            style={{ background: 'linear-gradient(135deg, #4A5E3A, #8A9E6C)' }}>
                            {u.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm" style={{ color: '#2C3E1E' }}>{u.name}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                            <div className="flex gap-3 mt-1 text-xs text-gray-400">
                              <span>{u._count?.appointments || 0} appts</span>
                              <span>{u._count?.challengeProgress || 0} challenges</span>
                              <span>Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          {editingRole === u.id ? (
                            <div className="flex items-center gap-2 flex-wrap">
                              {['patient', 'doctor', 'admin'].map(r => (
                                <button key={r} onClick={() => handleRoleUpdate(u.id, r)}
                                  disabled={updatingId === u.id}
                                  className="text-xs px-3 py-1.5 rounded-full border font-semibold capitalize transition"
                                  style={{ borderColor: ROLE_COLORS[r]?.text, color: ROLE_COLORS[r]?.text, background: u.role === r ? ROLE_COLORS[r]?.bg : 'white' }}>
                                  {updatingId === u.id ? '...' : r}
                                </button>
                              ))}
                              <button onClick={() => setEditingRole(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold px-3 py-1 rounded-full capitalize" style={{ background: rc.bg, color: rc.text }}>{u.role}</span>
                              {u.id !== user?.id && (
                                <button onClick={() => setEditingRole(u.id)}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-[#4A5E3A] hover:bg-[#E8EDE0] transition-colors">
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          )}
                          {u.id !== user?.id && (
                            <button onClick={() => handleDeleteUser(u.id)} disabled={deletingId === u.id}
                              className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-colors shrink-0">
                              {deletingId === u.id ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* APPOINTMENTS */}
            {tab === 'appointments' && (
              <div>
                <p className="text-sm text-gray-400 mb-4">{appointments.length} total appointments</p>
                {appointments.length === 0 ? (
                  <div className="bg-white rounded-2xl border p-12 text-center" style={{ borderColor: '#E8EDE0' }}>
                    <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: '#6B7F5E' }} />
                    <p className="text-gray-400 text-sm">No appointments found.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {appointments.map((a, i) => {
                      const sc = STATUS_COLORS[a.status] || STATUS_COLORS.pending
                      return (
                        <div key={a.id || i} className="bg-white rounded-2xl border p-5 flex flex-wrap items-center gap-4" style={{ borderColor: '#E8EDE0' }}>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm" style={{ color: '#2C3E1E' }}>
                              {a.user?.name || 'Patient'}
                              <span className="font-normal text-gray-400"> â†’ </span>
                              {a.therapist?.name || 'Therapist'}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {new Date(a.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {a.time}
                            </p>
                          </div>
                          <span className="text-xs font-semibold px-3 py-1 rounded-full capitalize" style={{ background: sc.bg, color: sc.text }}>{a.status}</span>
                          <div className="flex gap-2 flex-wrap">
                            {['pending', 'confirmed', 'completed', 'cancelled'].filter(s => s !== a.status).map(s => (
                              <button key={s} onClick={() => handleStatusUpdate(a.id, s)}
                                disabled={updatingId === a.id}
                                className="text-xs px-3 py-1.5 rounded-full border font-medium capitalize transition hover:opacity-80"
                                style={{ borderColor: STATUS_COLORS[s]?.text, color: STATUS_COLORS[s]?.text }}>
                                {updatingId === a.id ? '...' : `â†’ ${s}`}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* THERAPISTS */}
            {tab === 'therapists' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-400">{therapists.length} therapists</p>
                  <button onClick={() => setShowAddTherapist(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white hover:shadow-md transition-all"
                    style={{ background: 'linear-gradient(135deg, #4A5E3A, #6B7F5E)' }}>
                    <Plus className="w-4 h-4" /> Add Therapist
                  </button>
                </div>
                {showAddTherapist && (
                  <div className="bg-white rounded-2xl border p-6 mb-6" style={{ borderColor: '#D4DBC8' }}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold" style={{ color: '#2C3E1E' }}>New Therapist</h3>
                      <button onClick={() => setShowAddTherapist(false)} className="text-gray-400"><X className="w-4 h-4" /></button>
                    </div>
                    {therapistError && <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-2 mb-4">{therapistError}</div>}
                    <form onSubmit={handleAddTherapist} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: 'name', label: 'Full Name', placeholder: 'Dr. Jane Smith', type: 'text' },
                        { key: 'email', label: 'Email', placeholder: 'jane@herspace.com', type: 'email' },
                        { key: 'specialization', label: 'Specialization', placeholder: 'Anxiety & Depression', type: 'text' },
                        { key: 'experience', label: 'Years Experience', placeholder: '10', type: 'number' },
                        { key: 'sessionPrice', label: 'Session Price ($)', placeholder: '0 = free', type: 'number' },
                      ].map(f => (
                        <div key={f.key}>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{f.label}</label>
                          <input type={f.type} placeholder={f.placeholder} required value={therapistForm[f.key]}
                            onChange={e => setTherapistForm({ ...therapistForm, [f.key]: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#6B7F5E] outline-none text-sm" />
                        </div>
                      ))}
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Bio</label>
                        <textarea rows={2} value={therapistForm.bio}
                          onChange={e => setTherapistForm({ ...therapistForm, bio: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#6B7F5E] outline-none text-sm resize-none" />
                      </div>
                      <div className="md:col-span-2 flex items-center gap-3">
                        <input type="checkbox" id="isFree" checked={therapistForm.isFreeSupport}
                          onChange={e => setTherapistForm({ ...therapistForm, isFreeSupport: e.target.checked })} className="w-4 h-4 accent-[#4A5E3A]" />
                        <label htmlFor="isFree" className="text-sm text-gray-600">Offers free support tier</label>
                      </div>
                      <div className="md:col-span-2 flex gap-3 pt-2">
                        <button type="submit" disabled={addingTherapist} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2"
                          style={{ background: addingTherapist ? '#8A9E6C' : '#4A5E3A' }}>
                          {addingTherapist ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                          {addingTherapist ? 'Creating...' : 'Create Therapist'}
                        </button>
                        <button type="button" onClick={() => setShowAddTherapist(false)} className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-500 border border-gray-200">Cancel</button>
                      </div>
                    </form>
                  </div>
                )}
                {therapists.length === 0 ? (
                  <div className="bg-white rounded-2xl border p-12 text-center" style={{ borderColor: '#E8EDE0' }}>
                    <UserCheck className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: '#6B7F5E' }} />
                    <p className="text-gray-400 text-sm">No therapists yet.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {therapists.map((t, i) => (
                      <div key={t.id || t._id || i} className="bg-white rounded-2xl border p-5 flex items-start gap-4" style={{ borderColor: '#E8EDE0' }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                          style={{ background: 'linear-gradient(135deg, #4A5E3A, #8A9E6C)' }}>
                          {t.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm" style={{ color: '#2C3E1E' }}>{t.name}</p>
                          <p className="text-xs text-gray-400">{t.specialization} Â· {t.experience}yr</p>
                          <p className="text-xs text-gray-400">{t.email}</p>
                          <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: (t.sessionPrice === 0 || t.isFreeSupport) ? '#E8EDE0' : '#FEF3C7', color: (t.sessionPrice === 0 || t.isFreeSupport) ? '#4A5E3A' : '#D97706' }}>
                            {(t.sessionPrice === 0 || t.isFreeSupport) ? 'Free' : `$${t.sessionPrice}/session`}
                          </span>
                        </div>
                        <button onClick={() => handleDeleteTherapist(t.id || t._id)} disabled={deletingId === (t.id || t._id)}
                          className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-colors shrink-0">
                          {deletingId === (t.id || t._id) ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CHALLENGES */}
            {tab === 'challenges' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-400">{challenges.length} challenges</p>
                  <button onClick={() => setShowAddChallenge(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white hover:shadow-md transition-all"
                    style={{ background: 'linear-gradient(135deg, #4A5E3A, #6B7F5E)' }}>
                    <Plus className="w-4 h-4" /> Add Challenge
                  </button>
                </div>
                {showAddChallenge && (
                  <div className="bg-white rounded-2xl border p-6 mb-6" style={{ borderColor: '#D4DBC8' }}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold" style={{ color: '#2C3E1E' }}>New Challenge</h3>
                      <button onClick={() => setShowAddChallenge(false)} className="text-gray-400"><X className="w-4 h-4" /></button>
                    </div>
                    {challengeError && <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-2 mb-4">{challengeError}</div>}
                    <form onSubmit={handleAddChallenge} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                        <input type="text" placeholder="30-Day Mindfulness" required value={challengeForm.title}
                          onChange={e => setChallengeForm({ ...challengeForm, title: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#6B7F5E] outline-none text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Duration (days)</label>
                        <input type="number" placeholder="30" required value={challengeForm.duration}
                          onChange={e => setChallengeForm({ ...challengeForm, duration: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#6B7F5E] outline-none text-sm" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                        <textarea rows={2} required value={challengeForm.description}
                          onChange={e => setChallengeForm({ ...challengeForm, description: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#6B7F5E] outline-none text-sm resize-none" />
                      </div>
                      <div className="md:col-span-2 flex gap-3 pt-2">
                        <button type="submit" disabled={addingChallenge} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2"
                          style={{ background: addingChallenge ? '#8A9E6C' : '#4A5E3A' }}>
                          {addingChallenge ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                          {addingChallenge ? 'Creating...' : 'Create Challenge'}
                        </button>
                        <button type="button" onClick={() => setShowAddChallenge(false)} className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-500 border border-gray-200">Cancel</button>
                      </div>
                    </form>
                  </div>
                )}
                {challenges.length === 0 ? (
                  <div className="bg-white rounded-2xl border p-12 text-center" style={{ borderColor: '#E8EDE0' }}>
                    <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: '#6B7F5E' }} />
                    <p className="text-gray-400 text-sm">No challenges yet.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {challenges.map((c, i) => (
                      <div key={c.id || c._id || i} className="bg-white rounded-2xl border p-5 flex items-start gap-4" style={{ borderColor: '#E8EDE0' }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: 'linear-gradient(135deg, #E8EDE0, #D4DBC8)' }}>
                          <BookOpen className="w-4 h-4" style={{ color: '#4A5E3A' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm" style={{ color: '#2C3E1E' }}>{c.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{c.description}</p>
                          <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#E8EDE0', color: '#4A5E3A' }}>{c.duration} days</span>
                        </div>
                        <button onClick={() => handleDeleteChallenge(c.id || c._id)} disabled={deletingId === (c.id || c._id)}
                          className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-colors shrink-0">
                          {deletingId === (c.id || c._id) ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* RESOURCES */}
            {tab === 'resources' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-400">{resources.length} resources</p>
                  <button onClick={() => setShowAddResource(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white hover:shadow-md transition-all"
                    style={{ background: 'linear-gradient(135deg, #4A5E3A, #6B7F5E)' }}>
                    <Plus className="w-4 h-4" /> Add Resource
                  </button>
                </div>
                {showAddResource && (
                  <div className="bg-white rounded-2xl border p-6 mb-6" style={{ borderColor: '#D4DBC8' }}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold" style={{ color: '#2C3E1E' }}>New Support Resource</h3>
                      <button onClick={() => setShowAddResource(false)} className="text-gray-400"><X className="w-4 h-4" /></button>
                    </div>
                    {resourceError && <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-2 mb-4">{resourceError}</div>}
                    <form onSubmit={handleAddResource} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Name</label>
                        <input type="text" placeholder="Crisis Text Line" required value={resourceForm.name}
                          onChange={e => setResourceForm({ ...resourceForm, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#6B7F5E] outline-none text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Contact</label>
                        <input type="text" placeholder="Text HOME to 741741" required value={resourceForm.phone}
                          onChange={e => setResourceForm({ ...resourceForm, phone: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#6B7F5E] outline-none text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                        <select value={resourceForm.category} onChange={e => setResourceForm({ ...resourceForm, category: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#6B7F5E] outline-none text-sm bg-white">
                          {['Crisis', 'Safety', 'Substance', 'Eating', 'General'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="md:col-span-2 flex gap-3 pt-2">
                        <button type="submit" disabled={addingResource} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2"
                          style={{ background: addingResource ? '#8A9E6C' : '#4A5E3A' }}>
                          {addingResource ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                          {addingResource ? 'Creating...' : 'Create Resource'}
                        </button>
                        <button type="button" onClick={() => setShowAddResource(false)} className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-500 border border-gray-200">Cancel</button>
                      </div>
                    </form>
                  </div>
                )}
                {resources.length === 0 ? (
                  <div className="bg-white rounded-2xl border p-12 text-center" style={{ borderColor: '#E8EDE0' }}>
                    <Phone className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: '#6B7F5E' }} />
                    <p className="text-gray-400 text-sm">No resources yet.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {resources.map((r, i) => (
                      <div key={r.id || r._id || i} className="bg-white rounded-2xl border p-5 flex items-center gap-4" style={{ borderColor: '#E8EDE0' }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#FEE2E2' }}>
                          <Phone className="w-4 h-4" style={{ color: '#EF4444' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm" style={{ color: '#2C3E1E' }}>{r.name}</p>
                          <p className="text-xs text-gray-400">{r.phone}</p>
                          <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#E8EDE0', color: '#4A5E3A' }}>{r.category}</span>
                        </div>
                        <button onClick={() => handleDeleteResource(r.id || r._id)} disabled={deletingId === (r.id || r._id)}
                          className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-colors shrink-0">
                          {deletingId === (r.id || r._id) ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
