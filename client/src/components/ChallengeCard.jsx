import { Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

function ChallengeCard({ challenge }) {
  const colorClasses = {
    purple: {
      bg: 'from-purple-500 to-purple-600',
      light: 'bg-purple-50',
      text: 'text-purple-600',
      progress: 'bg-purple-500'
    },
    pink: {
      bg: 'from-pink-500 to-pink-600',
      light: 'bg-pink-50',
      text: 'text-pink-600',
      progress: 'bg-pink-500'
    },
    teal: {
      bg: 'from-teal-500 to-teal-600',
      light: 'bg-teal-50',
      text: 'text-teal-600',
      progress: 'bg-teal-500'
    },
    yellow: {
      bg: 'from-yellow-500 to-yellow-600',
      light: 'bg-yellow-50',
      text: 'text-yellow-600',
      progress: 'bg-yellow-500'
    }
  };

  const colors = colorClasses[challenge.color] || colorClasses.purple;
  const isStarted = challenge.daysCompleted > 0;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Header with Icon */}
      <div className={`bg-gradient-to-r ${colors.bg} p-6 text-white`}>
        <div className="text-5xl mb-2">{challenge.icon}</div>
        <h3 className="text-2xl font-bold mb-2">{challenge.title}</h3>
        <p className="text-white/90 text-sm">{challenge.description}</p>
      </div>

      <div className="p-6">
        {/* Category Badge */}
        <div className="mb-4">
          <span className={`${colors.light} ${colors.text} text-xs font-semibold px-3 py-1 rounded-full`}>
            {challenge.category}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Progress: {challenge.daysCompleted}/{challenge.totalDays} days
            </span>
            <span className={`text-sm font-bold ${colors.text}`}>
              {challenge.progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`${colors.progress} h-full rounded-full transition-all duration-500 flex items-center justify-end`}
              style={{ width: `${challenge.progress}%` }}
            >
              {challenge.progress > 10 && (
                <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
              )}
            </div>
          </div>
        </div>

        {/* Daily Tasks Preview */}
        {isStarted && challenge.dailyTasks && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Today's Tasks:</h4>
            <ul className="space-y-1">
              {challenge.dailyTasks.slice(0, 2).map((task, index) => (
                <li key={index} className="text-xs text-gray-600 flex items-start">
                  <span className="mr-2">✓</span>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span className="text-xs">
              {challenge.participants.toLocaleString()} participants
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className={`w-4 h-4 ${colors.text}`} />
            <span className={`text-xs font-semibold ${colors.text}`}>
              Active
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to="/challenges"
          className={`block w-full text-center py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            isStarted
              ? `${colors.light} ${colors.text} hover:shadow-md`
              : `bg-gradient-to-r ${colors.bg} text-white hover:shadow-lg`
          } transform hover:-translate-y-1`}
        >
          {isStarted ? 'Continue Challenge' : 'Start Challenge'}
        </Link>
      </div>
    </div>
  );
}

export default ChallengeCard;
