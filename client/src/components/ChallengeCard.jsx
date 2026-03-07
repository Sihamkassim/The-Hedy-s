import { Users, TrendingUp, Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'

const NATURE_PALETTES = [
  { header: 'linear-gradient(135deg, #2C3E1E, #4A5E3A)', accent: '#4A5E3A', light: '#E8EDE0', lightText: '#4A5E3A' },
  { header: 'linear-gradient(135deg, #4A5E3A, #6B7F5E)', accent: '#6B7F5E', light: '#EFF5E8', lightText: '#4A5E3A' },
  { header: 'linear-gradient(135deg, #6B7F5E, #8A9E6C)', accent: '#8A9E6C', light: '#F0F4EA', lightText: '#4A5E3A' },
  { header: 'linear-gradient(135deg, #5C4A3A, #C17A55)', accent: '#C17A55', light: '#FDF6F0', lightText: '#5C4A3A' },
]

function ChallengeCard({ challenge }) {
  // Pick palette based on challenge id or index for visual variety
  const paletteIndex = (parseInt(challenge.id) || 0) % NATURE_PALETTES.length
  const palette = NATURE_PALETTES[paletteIndex]
  const daysCompleted = challenge.daysCompleted ?? 0
  const totalDays = challenge.totalDays ?? challenge.duration ?? 30
  const progressPct = challenge.progress ?? (totalDays > 0 ? Math.round((daysCompleted / totalDays) * 100) : 0)
  const isStarted = daysCompleted > 0
  const participants = challenge.participants ?? challenge.participantCount ?? 0
  const icon = challenge.icon ?? '🌿'

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-6 text-white" style={{ background: palette.header }}>
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className="text-xl font-bold mb-1 leading-snug">{challenge.title}</h3>
        <p className="text-white/80 text-sm line-clamp-2">{challenge.description}</p>
      </div>

      <div className="p-5">
        {/* Duration badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: palette.light, color: palette.lightText }}>
            {totalDays} days
          </span>
          {isStarted && (
            <span className="text-xs font-semibold" style={{ color: palette.accent }}>
              {progressPct}% done
            </span>
          )}
        </div>

        {/* Progress bar */}
        {isStarted && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-gray-500">{daysCompleted}/{totalDays} days completed</span>
            </div>
            <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: '#E8EDE0' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%`, background: palette.accent }}
              />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: '1px solid #E8EDE0' }}>
          <div className="flex items-center space-x-1.5 text-gray-500">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs">{participants.toLocaleString()} joined</span>
          </div>
          <div className="flex items-center space-x-1" style={{ color: palette.accent }}>
            <Leaf className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">Active</span>
          </div>
        </div>

        {/* Action button */}
        <Link
          to="/challenges"
          className="block w-full text-center py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
          style={isStarted
            ? { background: palette.light, color: palette.lightText }
            : { background: palette.header, color: '#fff' }
          }
        >
          {isStarted ? 'Continue Challenge' : 'Join Challenge'}
        </Link>
      </div>
    </div>
  )
}

export default ChallengeCard
