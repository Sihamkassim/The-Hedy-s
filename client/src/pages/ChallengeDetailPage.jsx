import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { challengeAPI } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { Leaf, Award, CheckCircle, ChevronLeft, Calendar, Loader, Star } from 'lucide-react'

export default function ChallengeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  
  const [challenge, setChallenge] = useState(null)
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/challenges')
      return
    }

    const loadData = async () => {
      try {
        const [cRes, pRes] = await Promise.all([
          challengeAPI.getOne(id),
          challengeAPI.getMyProgress()
        ])
        
        setChallenge(cRes.data.data?.challenge || null)
        const myProg = pRes.data.data?.progress?.find(p => p.challengeId === id)
        setProgress(myProg || null)
      } catch (err) {
        setError('Failed to load challenge details')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id, isAuthenticated, navigate])

  const handleCompleteToday = async () => {
    setUpdating(true)
    try {
      const res = await challengeAPI.updateProgress(id, {}) // no payload needed for the new controller
      setProgress(res.data.data.progress)
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update progress')
    }
    setUpdating(false)
  }

  if (loading) return <div className="flex justify-center py-20"><Loader className="w-8 h-8 animate-spin text-[#4A5E3A]" /></div>
  if (error || !challenge) return <div className="text-center py-20 text-gray-500">{error || 'Challenge not found'}</div>

  // Check if completed today
  let completedToday = false
  if (progress?.lastLogDate) {
    const lastLog = new Date(progress.lastLogDate)
    const today = new Date()
    completedToday = (
      lastLog.getDate() === today.getDate() &&
      lastLog.getMonth() === today.getMonth() &&
      lastLog.getFullYear() === today.getFullYear()
    )
  }

  const completedCount = progress?.completedDays || 0
  const isFinished = completedCount >= challenge.duration

  // Duolingo style path visualization
  const days = Array.from({ length: challenge.duration }).map((_, i) => {
    const isCompleted = i < completedCount
    const isCurrent = i === completedCount && !completedToday && !isFinished
    const isTodayDone = i === completedCount - 1 && completedToday

    // The task content mapped for the day
    const taskText = !challenge.isRepetitive && challenge.dailyTasks?.[i] 
      ? challenge.dailyTasks[i] 
      : challenge.description

    return { dayNum: i + 1, isCompleted, isCurrent, isTodayDone, taskText }
  })

  return (
    <div className="min-h-screen bg-[#F7F4EF] pb-20">
      {/* Header */}
      <div className="pt-8 pb-12 px-4" style={{ background: 'linear-gradient(135deg, #2C3E1E, #4A5E3A)', color: '#fff' }}>
        <div className="max-w-3xl mx-auto">
          <Link to="/challenges" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Challenges
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-white/10 text-[#A3C17A]">
                <Calendar className="w-3.5 h-3.5" /> {challenge.duration} Day Journey
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{challenge.title}</h1>
              <p className="text-white/80 text-sm max-w-xl">{challenge.description}</p>
            </div>
            
            {/* Master Progress Circle */}
            <div className="hidden md:flex flex-col items-center justify-center shrink-0 w-24 h-24 rounded-full border-4 border-white/20 bg-white/10 relative">
              <span className="text-2xl font-bold">{completedCount}</span>
              <span className="text-[10px] uppercase tracking-wider text-white/70">Days</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8EDE0] mb-8 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[#2C3E1E]">Your Progress</h3>
            <p className="text-sm text-gray-500">{completedCount} of {challenge.duration} days completed</p>
          </div>
          
          {isFinished ? (
            <div className="flex items-center gap-2 text-[#065F46] font-bold bg-[#D1FAE5] px-5 py-2.5 rounded-full">
              <Award className="w-5 h-5" /> Challenge Completed!
            </div>
          ) : completedToday ? (
            <div className="flex items-center gap-2 text-gray-500 font-semibold bg-gray-100 px-5 py-2.5 rounded-full">
              <CheckCircle className="w-5 h-5 text-green-500" /> Done for today
            </div>
          ) : (
            <button 
              onClick={handleCompleteToday}
              disabled={updating || !progress}
              className="flex items-center gap-2 bg-[#4A5E3A] hover:bg-[#3d4d30] text-white px-6 py-3 rounded-full font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {updating ? <Loader className="w-5 h-5 animate-spin" /> : <Star className="w-5 h-5" />}
              Complete Today's Task
            </button>
          )}
        </div>

        {/* Trail / Path UI */}
        <div className="relative py-8">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-[#E8EDE0] -ml-0.5 rounded-full z-0" />
          
          <div className="space-y-6 relative z-10">
            {days.map((d, i) => (
              <div key={i} className={`flex items-center gap-6 md:justify-between ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                
                {/* Desktop Spacer */}
                <div className="hidden md:block md:w-[45%]" />
                
                {/* Node */}
                <div className="relative shrink-0">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 z-10 relative bg-white shadow-sm transition-all
                    ${d.isCompleted ? 'border-[#4A5E3A] bg-[#4A5E3A] text-white scale-100' : d.isCurrent ? 'border-[#A3C17A] text-[#4A5E3A] scale-110 shadow-md ring-4 ring-[#A3C17A]/20' : 'border-gray-200 text-gray-400 opacity-60 scale-90'}`}>
                    {d.isCompleted ? <CheckCircle className="w-7 h-7" /> : <span className="font-bold text-lg">{d.dayNum}</span>}
                  </div>
                </div>

                {/* Card */}
                <div className="flex-1 md:w-[45%]">
                  <div className={`p-5 rounded-2xl border transition-all ${d.isCurrent ? 'bg-white shadow-md border-[#A3C17A]' : d.isCompleted ? 'bg-[#F2F6ED] border-[#E8EDE0] opacity-80' : 'bg-white border-gray-100 opacity-60'}`}>
                    <h4 className={`text-sm font-bold uppercase tracking-wider mb-1 ${d.isCompleted ? 'text-[#4A5E3A]' : 'text-gray-400'}`}>
                      Day {d.dayNum} {d.isTodayDone && <span className="text-xs normal-case font-medium ml-2 text-[#6B7F5E] badge">(Completed Today)</span>}
                    </h4>
                    <p className={`text-sm ${d.isCompleted ? 'text-gray-600' : 'text-gray-500'}`}>
                      {d.taskText}
                    </p>
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
