import { Star, Calendar, Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'

function TherapistCard({ therapist }) {
  // Support both mock data (priceAmount) and API data (sessionPrice)
  const price = therapist.sessionPrice ?? therapist.priceAmount
  const isFree = price === 0 || price === null || therapist.isFree
  const displayPrice = isFree ? 'Free' : (therapist.price ?? `ETB${price ?? '?'}/session`)
  const initials = (therapist.name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Free Badge */}
      {isFree && (
        <div className="text-white text-xs font-semibold px-3 py-1.5 text-center tracking-wide" style={{ background: '#4A5E3A' }}>
          🌿 FREE SESSION AVAILABLE
        </div>
      )}

      <div className="p-6">
        {/* Avatar + Name */}
        <div className="flex items-start space-x-4 mb-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 text-white text-lg font-bold"
            style={{ background: 'linear-gradient(135deg, #4A5E3A, #8A9E6C)' }}
          >
            {initials}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-0.5">{therapist.name}</h3>
            <p className="text-sm font-medium mb-1.5" style={{ color: '#6B7F5E' }}>
              {therapist.specialization}
            </p>
            <div className="flex items-center space-x-2">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-700">{therapist.rating ?? '4.8'}</span>
              <span className="text-xs text-gray-400">({therapist.reviews ?? therapist.reviewCount ?? '0'} reviews)</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {therapist.bio}
        </p>

        {/* Availability */}
        {therapist.availability && therapist.availability.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-semibold text-gray-600">Available:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {therapist.availability.map((day, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#E8EDE0', color: '#4A5E3A' }}>
                  {day}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: '1px solid #E8EDE0' }}>
          <div className="flex items-center space-x-2">
            <Leaf className="w-4 h-4" style={{ color: isFree ? '#4A5E3A' : '#C17A55' }} />
            <span className="font-bold text-base" style={{ color: isFree ? '#4A5E3A' : '#2C3E1E' }}>
              {displayPrice}
            </span>
          </div>
          {isFree && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#E8EDE0', color: '#4A5E3A' }}>
              No cost
            </span>
          )}
        </div>

        {/* Book Button */}
        <Link
          to={`/booking/${therapist.id}`}
          className="block w-full text-center py-3 px-4 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #4A5E3A, #6B7F5E)' }}
        >
          Book Session
        </Link>
      </div>
    </div>
  )
}

export default TherapistCard
