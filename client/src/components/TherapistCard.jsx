import { Star, Calendar, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

function TherapistCard({ therapist }) {
  const isFree = therapist.priceAmount === 0;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Free Badge */}
      {isFree && (
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white text-xs font-semibold px-3 py-1 text-center">
          🌟 FREE SUPPORT AVAILABLE
        </div>
      )}

      <div className="p-6">
        {/* Therapist Image */}
        <div className="flex items-start space-x-4 mb-4">
          <img
            src={therapist.image}
            alt={therapist.name}
            className="w-20 h-20 rounded-full border-4 border-purple-100"
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {therapist.name}
            </h3>
            <p className="text-purple-600 font-medium text-sm mb-2">
              {therapist.specialization}
            </p>
            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="ml-1 text-sm font-semibold text-gray-700">
                  {therapist.rating}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                ({therapist.reviews} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {therapist.bio}
        </p>

        {/* Availability */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-semibold text-gray-700">Available:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {therapist.availability.map((day, index) => (
              <span
                key={index}
                className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full"
              >
                {day}
              </span>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <DollarSign className={`w-5 h-5 ${isFree ? 'text-teal-500' : 'text-purple-500'}`} />
            <span className={`font-bold text-lg ${isFree ? 'text-teal-600' : 'text-gray-800'}`}>
              {therapist.price}
            </span>
          </div>
        </div>

        {/* Book Button */}
        <Link
          to={`/booking/${therapist.id}`}
          className={`block w-full text-center py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            isFree
              ? 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white'
              : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white'
          } shadow-md hover:shadow-lg transform hover:-translate-y-1`}
        >
          Book Session
        </Link>
      </div>
    </div>
  );
}

export default TherapistCard;
