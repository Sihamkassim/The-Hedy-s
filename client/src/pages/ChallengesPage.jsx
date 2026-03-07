import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Leaf, TrendingUp, Award, Users, CheckCircle, Loader, Lock, ChevronRight, Sprout } from 'lucide-react'
import { challengeAPI } from '../api/services'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'

const mockChallenges = [
  { id: '1', title: '30-Day Mindfulness', description: 'Meditate for 10 minutes every day to build a calmer, more centered mind.', duration: 30, participants: 2840 },
  { id: '2', title: 'Gratitude Journal', description: 'Write 3 things you are grateful for each morning to rewire towards positivity.', duration: 21, participants: 1920 },
  { id: '3', title: 'Digital Detox', description: 'Reduce screen time by 1 hour daily to reconnect with yourself and nature.', duration: 14, participants: 1450 },
  { id: '4', title: 'Body Positivity', description: 'Daily affirmations and gentle movement to build a loving relationship with your body.', duration: 30, participants: 3200 },
]

const ICONS = ['🌿', '🌸', '🍃', '🌱', '🌻', '🦋']

function ChallengesPage() {
  const { isAuthenticated } = useAuth()
  const [challenges, setChallenges] = useState([])
  const [myProgress, setMyProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(null)
  const [filter, setFilter] = useState('all')
  const [showAuth, setShowAuth] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    challengeAPI.getAll()
      .then(r => setChallenges(r.data.data.challenges || r.data.data || []))
      .catch(() => setChallenges(mockChallenges))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      challengeAPI.getMyProgress()
        .then(r => setMyProgress(r.data.data.progress || []))
        .catch(() => {})
    }
  }, [isAuthenticated])

  const joinedIds = myProgress.map(p => p.challengeId)

  const filteredChallenges = challenges.filter(c => {
    if (filter === 'joined') return joinedIds.includes(c.id)
    if (filter === 'new') return !joinedIds.includes(c.id)
    return true
  })

  const handleJoin = async (id) => {
    if (!isAuthenticated) { setShowAuth(true); return }
    setJoining(id)
    try {
      await challengeAPI.join(id)
      const r = await challengeAPI.getMyProgress()
      setMyProgress(r.data.data.progress || [])
      showToast('Challenge joined! Your journey begins today 🌿')
    } catch (e) {
      showToast(e.response?.data?.message || 'Could not join challenge', 'error')
    } finally {
      setJoining(null)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#F7F4EF' }}>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold text-white"
          style={{ background: toast.type === 'error' ? '#EF4444' : '#4A5E3A' }}>
          {toast.msg}
        </div>
      )}

      {/* Hero */}
      <div className="py-16 px-4" style={{ background: 'linear-gradient(135deg, #2C3E1E, #4A5E3A)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'rgba(255,255,255,0.12)', color: '#A3C17A' }}>
            <Sprout className="w-4 h-4" /> Personal growth challenges
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Transform your life,<br />
            <span style={{ color: '#A3C17A' }}>one day at a time</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Join structured wellness challenges designed to build habits that last. 
            Track your progress, earn milestones, and grow alongside a supportive community.
          </p>
          {/* Stats row */}
          <div className="flex justify-center gap-8 mt-10">
            {[
              { label: 'Active Participants', value: challenges.reduce((s, c) => s + (c._count?.progress || c.participants || 0), 0).toLocaleString() || '0' },
              { label: 'Challenges', value: challenges.length || '0' },
              { label: 'Days of Growth', value: challenges.reduce((s, c) => s + (c.duration || 0), 0) || '0' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-white">{loading ? '—' : s.value}</div>
                <div className="text-xs text-white/50 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="sticky top-0 z-10 py-3 px-4 border-b" style={{ background: '#F7F4EF', borderColor: '#D4DBC8' }}>
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          {['all', 'joined', 'new'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all capitalize"
              style={filter === f
                ? { background: '#4A5E3A', color: '#fff' }
                : { background: '#E8EDE0', color: '#4A5E3A' }}>
              {f === 'all' ? 'All' : f === 'joined' ? 'My Challenges' : 'Discover'}
            </button>
          ))}
          {!isAuthenticated && (
            <button onClick={() => setShowAuth(true)}
              className="ml-auto flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full"
              style={{ background: '#E8EDE0', color: '#4A5E3A' }}>
              <Lock className="w-3 h-3" /> Sign in to track progress
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="rounded-2xl h-64 animate-pulse" style={{ background: '#E8EDE0' }} />
            ))}
          </div>
        ) : filteredChallenges.length === 0 ? (
          <div className="text-center py-20">
            <Leaf className="w-12 h-12 mx-auto mb-4 opacity-20" style={{ color: '#4A5E3A' }} />
            <p className="text-gray-400">
              {filter === 'joined' ? "You haven't joined any challenges yet." : 'No challenges found.'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredChallenges.map((challenge, idx) => {
              const progress = myProgress.find(p => p.challengeId === challenge.id)
              const isJoined = !!progress
              const pct = progress ? Math.round((progress.completedDays / (challenge.duration || 30)) * 100) : 0

              return (
                <div key={challenge.id}
                  className="rounded-2xl overflow-hidden border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                  style={{ background: '#fff', borderColor: '#E8EDE0' }}>

                  {/* Card header */}
                  <div className="p-6" style={{ background: 'linear-gradient(135deg, #2C3E1E, #4A5E3A)' }}>
                    <div className="text-4xl mb-3">{ICONS[idx % ICONS.length]}</div>
                    <h3 className="text-xl font-bold text-white mb-1">{challenge.title}</h3>
                    <p className="text-white/70 text-sm">{challenge.description}</p>
                  </div>

                  <div className="p-6">
                    {/* Meta */}
                    <div className="flex items-center justify-between mb-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {((challenge._count?.progress) || challenge.participants || 0).toLocaleString()} joined
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {challenge.duration} days
                      </span>
                    </div>

                    {/* Progress bar (if joined) */}
                    {isJoined && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span style={{ color: '#4A5E3A' }} className="font-semibold">
                            Day {progress.completedDays} of {challenge.duration}
                          </span>
                          <span style={{ color: '#6B7F5E' }} className="font-bold">{pct}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full" style={{ background: '#E8EDE0' }}>
                          <div className="h-2 rounded-full transition-all"
                            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #4A5E3A, #8A9E6C)' }} />
                        </div>
                      </div>
                    )}

                    {/* Action */}
                    <div className="flex items-center gap-3">
                      {isJoined ? (
                        <Link to={`/challenges/${challenge.id}`} className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full transition-colors hover:opacity-80"
                          style={{ background: '#4A5E3A', color: '#fff' }}>
                          <CheckCircle className="w-3.5 h-3.5" /> Continue Journey
                        </Link>
                      ) : (
                        <button onClick={() => handleJoin(challenge.id)}
                          disabled={joining === challenge.id}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-opacity disabled:opacity-60"
                          style={{ background: 'linear-gradient(135deg, #4A5E3A, #6B7F5E)' }}>
                          {joining === challenge.id
                            ? <><Loader className="w-4 h-4 animate-spin" /> Joining...</>
                            : <><Sprout className="w-4 h-4" /> Join Challenge</>}
                        </button>
                      )}
                      <span className="ml-auto flex items-center gap-1 text-xs" style={{ color: '#8A9E6C' }}>
                        <Award className="w-3.5 h-3.5" /> {challenge.duration}-day program
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Why section */}
        <div className="mt-16 rounded-3xl p-10 text-center" style={{ background: 'linear-gradient(135deg, #2C3E1E, #4A5E3A)' }}>
          <h2 className="text-2xl font-bold text-white mb-2">Why join a wellness challenge?</h2>
          <p className="text-white/60 text-sm mb-8 max-w-xl mx-auto">
            Science-backed daily micro-habits compound into transformational change over time.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: TrendingUp, title: 'Track Progress', desc: 'Visual milestones keep you motivated every step of the way.' },
              { icon: Users, title: 'Community', desc: 'Thousands of women on the same journey, cheering you forward.' },
              { icon: Award, title: 'Earn Milestones', desc: 'Celebrate wins — big and small — as you grow each day.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="rounded-2xl p-6 text-left" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: 'rgba(163,193,122,0.2)' }}>
                  <Icon className="w-5 h-5" style={{ color: '#A3C17A' }} />
                </div>
                <h3 className="font-bold text-white mb-1">{title}</h3>
                <p className="text-white/50 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}

export default ChallengesPage

   