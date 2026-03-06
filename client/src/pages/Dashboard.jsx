import { Link } from 'react-router-dom';
import { Calendar, TrendingUp, Heart, Award, Clock, Video, MapPin, Plus, ArrowRight } from 'lucide-react';
import { appointments, challenges, therapists } from '../data/mockData';

function Dashboard() {
  const upcomingAppointments = appointments.filter(apt => apt.status === 'upcoming');
  const activeChallenges = challenges.filter(c => c.daysCompleted > 0 && c.daysCompleted < c.totalDays);
  const completedAppointments = appointments.filter(apt => apt.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome Back! 💜</h1>
              <p className="text-xl text-white/90">
                You're doing great on your wellness journey. Keep it up!
              </p>
            </div>
            <Heart className="w-20 h-20 fill-white/20" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-purple-600" />
              <span className="text-3xl font-bold text-gray-800">{upcomingAppointments.length}</span>
            </div>
            <p className="text-gray-600 font-semibold">Upcoming Sessions</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-teal-600" />
              <span className="text-3xl font-bold text-gray-800">{activeChallenges.length}</span>
            </div>
            <p className="text-gray-600 font-semibold">Active Challenges</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-pink-600" />
              <span className="text-3xl font-bold text-gray-800">{completedAppointments.length}</span>
            </div>
            <p className="text-gray-600 font-semibold">Completed Sessions</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-8 h-8 text-red-500" />
              <span className="text-3xl font-bold text-gray-800">
                {Math.round(activeChallenges.reduce((sum, c) => sum + c.progress, 0) / (activeChallenges.length || 1))}%
              </span>
            </div>
            <p className="text-gray-600 font-semibold">Avg Progress</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Appointments */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-purple-600" />
                  Upcoming Appointments
                </h2>
                <Link
                  to="/therapists"
                  className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Book New
                </Link>
              </div>

              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => {
                    const therapist = therapists.find(t => t.id === appointment.therapistId);
                    return (
                      <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                        <div className="flex items-start gap-4">
                          <img
                            src={therapist?.image}
                            alt={appointment.therapistName}
                            className="w-16 h-16 rounded-full border-2 border-purple-100"
                          />
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 mb-1">
                              {appointment.therapistName}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {therapist?.specialization}
                            </p>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-purple-600" />
                                <span>{new Date(appointment.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-purple-600" />
                                <span>{appointment.time}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {appointment.type === 'Video Call' ? (
                                  <Video className="w-4 h-4 text-purple-600" />
                                ) : (
                                  <MapPin className="w-4 h-4 text-purple-600" />
                                )}
                                <span>{appointment.type}</span>
                              </div>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold hover:bg-purple-200 transition-colors text-sm">
                            Join Session
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No upcoming appointments</p>
                  <Link
                    to="/therapists"
                    className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                  >
                    Book Your First Session
                  </Link>
                </div>
              )}
            </div>

            {/* Active Challenges */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-teal-600" />
                  My Challenges
                </h2>
                <Link
                  to="/challenges"
                  className="text-teal-600 hover:text-teal-700 font-semibold text-sm flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {activeChallenges.length > 0 ? (
                <div className="space-y-4">
                  {activeChallenges.map((challenge) => (
                    <div key={challenge.id} className="border border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{challenge.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 mb-2">{challenge.title}</h3>
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-semibold text-teal-600">{challenge.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-teal-500 to-teal-600 h-full rounded-full transition-all"
                                style={{ width: `${challenge.progress}%` }}
                              />
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            Day {challenge.daysCompleted} of {challenge.totalDays}
                          </p>
                        </div>
                        <Link
                          to="/challenges"
                          className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg font-semibold hover:bg-teal-200 transition-colors text-sm"
                        >
                          Continue
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No active challenges yet</p>
                  <Link
                    to="/challenges"
                    className="inline-block bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                  >
                    Start a Challenge
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/therapists"
                  className="block w-full bg-purple-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Book a Session
                </Link>
                <Link
                  to="/challenges"
                  className="block w-full bg-teal-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                >
                  Browse Challenges
                </Link>
                <Link
                  to="/free-help"
                  className="block w-full bg-pink-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
                >
                  Get Free Support
                </Link>
              </div>
            </div>

            {/* Recommended Content */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-4">Recommended for You</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    🧘‍♀️ Mindfulness Meditation
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    5-minute guided meditation for anxiety relief
                  </p>
                  <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm">
                    Start Session →
                  </button>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    📖 Article: Building Self-Love
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    5 daily practices to cultivate self-compassion
                  </p>
                  <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm">
                    Read More →
                  </button>
                </div>
              </div>
            </div>

            {/* Crisis Support */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-6 text-white">
              <h3 className="font-bold mb-2">Need Immediate Help?</h3>
              <p className="text-sm text-white/90 mb-4">
                If you're in crisis, we're here 24/7
              </p>
              <a
                href="tel:988"
                className="block w-full bg-white text-red-600 text-center py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                Call 988 Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
