import { useState } from 'react';
import { Target, TrendingUp, Award, Calendar as CalendarIcon } from 'lucide-react';
import ChallengeCard from '../components/ChallengeCard';
import { challenges } from '../data/mockData';

function ChallengesPage() {
  const [filter, setFilter] = useState('all'); // all, active, not-started

  const filteredChallenges = challenges.filter(challenge => {
    if (filter === 'all') return true;
    if (filter === 'active') return challenge.daysCompleted > 0 && challenge.daysCompleted < challenge.totalDays;
    if (filter === 'not-started') return challenge.daysCompleted === 0;
    return true;
  });

  // Sample challenge for detailed view
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  if (selectedChallenge) {
    const challenge = challenges.find(c => c.id === selectedChallenge);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSelectedChallenge(null)}
            className="text-purple-600 hover:text-purple-700 mb-6 font-semibold"
          >
            ← Back to Challenges
          </button>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className={`bg-gradient-to-r ${
              challenge.color === 'purple' ? 'from-purple-500 to-purple-600' :
              challenge.color === 'pink' ? 'from-pink-500 to-pink-600' :
              challenge.color === 'teal' ? 'from-teal-500 to-teal-600' :
              'from-yellow-500 to-yellow-600'
            } p-8 text-white`}>
              <div className="text-6xl mb-4">{challenge.icon}</div>
              <h1 className="text-4xl font-bold mb-3">{challenge.title}</h1>
              <p className="text-xl text-white/90">{challenge.description}</p>
            </div>

            {/* Progress */}
            <div className="p-8">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">Your Progress</h3>
                  <span className="text-3xl font-bold text-purple-600">{challenge.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${challenge.progress}%` }}
                  />
                </div>
                <p className="text-gray-600">
                  <span className="font-bold text-purple-600">{challenge.daysCompleted}</span> of {challenge.totalDays} days completed
                </p>
              </div>

              {/* Today's Tasks */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Today's Tasks</h3>
                <div className="space-y-3">
                  {challenge.dailyTasks.map((task, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="flex-1 text-gray-700">{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <CalendarIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{challenge.totalDays}</p>
                  <p className="text-sm text-gray-600">Total Days</p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg text-center">
                  <TrendingUp className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{challenge.daysCompleted}</p>
                  <p className="text-sm text-gray-600">Days Completed</p>
                </div>
                <div className="bg-pink-50 p-4 rounded-lg text-center">
                  <Award className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{challenge.participants.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Participants</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-lg font-bold hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg">
                  Mark Today Complete
                </button>
                <button className="px-6 bg-gray-100 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  Share Progress
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6">
            <Target className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            30-Day Personal Growth Challenges
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your life one day at a time. Join our supportive community in building 
            confidence, reducing anxiety, and developing self-love through structured daily practices.
          </p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {challenges.reduce((sum, c) => sum + c.participants, 0).toLocaleString()}
            </div>
            <p className="text-gray-600 font-semibold">Active Participants</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-4xl font-bold text-teal-600 mb-2">
              {challenges.length}
            </div>
            <p className="text-gray-600 font-semibold">Available Challenges</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-4xl font-bold text-pink-600 mb-2">
              30
            </div>
            <p className="text-gray-600 font-semibold">Days to Transform</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Challenges
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                filter === 'active'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter('not-started')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                filter === 'not-started'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Not Started
            </button>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {filteredChallenges.map((challenge) => (
            <div key={challenge.id} onClick={() => setSelectedChallenge(challenge.id)} className="cursor-pointer">
              <ChallengeCard challenge={challenge} />
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Why Join Our Challenges?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Structured Growth</h3>
                <p className="text-gray-600">Daily tasks designed by mental health experts to create lasting positive change.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-teal-600" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Track Progress</h3>
                <p className="text-gray-600">Visual progress tracking to see how far you've come and stay motivated.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6 text-pink-600" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Daily Reminders</h3>
                <p className="text-gray-600">Get gentle reminders to complete your daily tasks and stay on track.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Community Support</h3>
                <p className="text-gray-600">Join thousands of women on the same journey, supporting each other.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChallengesPage;
