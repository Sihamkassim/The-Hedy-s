import { Star, Calendar, Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'

function TherapistCard({ therapist }) {
  // Support both mock data (priceAmount) and API data (sessionPrice)
  const price = therapist.sessionPrice ?? therapist.priceAmount
  const isFree = price === 0 || price === null || therapist.isFree
  const displayPrice = isFree ? 'Free' : (therapist.price ?? `ETB${price ?? '?'}/session`)
  const initials = (therapist.name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="bg-base-bg text-base-text rounded-xl border border-accent/20 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Free Badge */}
      {isFree && (
        <div className="text-primary-inverse text-xs font-semibold px-3 py-1.5 text-center tracking-wide" style={{ background: 'var(--primary)' }}>
          🌿 FREE SESSION AVAILABLE
        </div>
      )}

      <div className="p-6">
        {/* Avatar + Name */}
        <div className="flex items-start space-x-4 mb-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 text-primary-inverse text-lg font-bold"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
          >
            {initials}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-0.5">{therapist.name}</h3>
            <p className="text-sm font-medium mb-1.5" style={{ color: 'var(--primary)' }}>
              {therapist.specialization}
            </p>
            <div className="flex items-center space-x-2">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">{therapist.rating ?? '4.8'}</span>
              <span className="text-xs opacity-60">({therapist.reviews ?? therapist.reviewCount ?? '0'} reviews)</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm mb-4 line-clamp-2 opacity-80">
          {therapist.bio}
        </p>

        {/* Availability */}
        {therapist.availability && therapist.availability.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2 opacity-60">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">Available:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {therapist.availability.map((day, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)', color: 'var(--primary)' }}>
                  {day}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-accent/20">
          <div className="flex items-center space-x-2">
            <Leaf className="w-4 h-4" style={{ color: isFree ? 'var(--primary)' : 'var(--accent)' }} />
            <span className="font-bold text-base" style={{ color: isFree ? 'var(--primary)' : 'var(--base-text)' }}>
              {displayPrice}
            </span>
          </div>
          {isFree && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)', color: 'var(--primary)' }}>
              No cost
            </span>
          )}
        </div>

        {/* Book Button */}
        <Link
          to={`/booking/${therapist.id}`}
          className="block w-full text-center py-3 px-4 rounded-xl font-semibold text-primary-inverse text-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
        >
          Book Session
        </Link>
      </div>
    </div>
  )
}

export default TherapistCard
