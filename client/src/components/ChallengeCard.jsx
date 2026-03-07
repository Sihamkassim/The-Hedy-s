import { Users, Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'

const APP_PALETTES = [
  { header: 'linear-gradient(135deg, var(--primary), var(--secondary))', accent: 'var(--accent)', light: 'color-mix(in srgb, var(--base-bg) 85%, var(--primary) 15%)', lightText: 'var(--base-text)' },
  { header: 'linear-gradient(135deg, var(--secondary), var(--accent))', accent: 'var(--primary)', light: 'color-mix(in srgb, var(--base-bg) 85%, var(--secondary) 15%)', lightText: 'var(--base-text)' },
  { header: 'linear-gradient(135deg, var(--accent), var(--primary))', accent: 'var(--secondary)', light: 'color-mix(in srgb, var(--base-bg) 85%, var(--accent) 15%)', lightText: 'var(--base-text)' },
]

function ChallengeCard({ challenge }) {
  // Pick palette based on challenge id or index for visual variety
  const paletteIndex = (parseInt(challenge.id) || 0) % APP_PALETTES.length
  const palette = APP_PALETTES[paletteIndex]
  const daysCompleted = challenge.daysCompleted ?? 0
  const totalDays = challenge.totalDays ?? challenge.duration ?? 30
  const progressPct = challenge.progress ?? (totalDays > 0 ? Math.round((daysCompleted / totalDays) * 100) : 0)
  const isStarted = daysCompleted > 0
  const participants = challenge.participants ?? challenge.participantCount ?? 0
  const icon = challenge.icon ?? '🌿'

  return (
    <div className="bg-base-bg text-base-text rounded-2xl border border-accent/20 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-6 text-primary-inverse" style={{ background: palette.header }}>
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className="text-xl font-bold mb-1 leading-snug">{challenge.title}</h3>
        <p className="text-primary-inverse opacity-80 text-sm line-clamp-2" style={{ color: 'color-mix(in srgb, var(--primary-inverse) 80%, transparent)' }}>{challenge.description}</p>
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
              <span className="text-xs opacity-60">{daysCompleted}/{totalDays} days completed</span>
            </div>
            <div className="w-full rounded-full h-2 overflow-hidden bg-accent/20">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%`, background: palette.accent }}
              />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-accent/20">
          <div className="flex items-center space-x-1.5 opacity-60">
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
            : { background: palette.header, color: 'var(--primary-inverse)' }
          }
        >
          {isStarted ? 'Continue Challenge' : 'Join Challenge'}
        </Link>
      </div>
    </div>
  )
}

export default ChallengeCard
