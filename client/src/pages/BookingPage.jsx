import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Video, MapPin, Star, CheckCircle, ArrowLeft } from 'lucide-react';
import { therapists, timeSlots } from '../data/mockData';

function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const therapist = therapists.find(t => t.id === parseInt(id));

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [sessionType, setSessionType] = useState('video');
  const [notes, setNotes] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  if (!therapist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Therapist not found</h2>
          <button
            onClick={() => navigate('/therapists')}
            className="text-purple-600 hover:text-purple-700"
          >
            Return to therapists
          </button>
        </div>
      </div>
    );
  }

  const handleBooking = (e) => {
    e.preventDefault();
    if (selectedDate && selectedTime) {
      setIsBooked(true);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isBooked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-gray-600 mb-8">
              Your session has been successfully booked. You'll receive a confirmation email shortly.
            </p>
            
            <div className="bg-purple-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">Session Details:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={therapist.image}
                    alt={therapist.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{therapist.name}</p>
                    <p className="text-sm text-gray-600">{therapist.specialization}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span>{new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span>{selectedTime}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  {sessionType === 'video' ? <Video className="w-5 h-5 text-purple-600" /> : <MapPin className="w-5 h-5 text-purple-600" />}
                  <span>{sessionType === 'video' ? 'Video Call' : 'In-Person'}</span>
                </div>
                {therapist.priceAmount > 0 && (
                  <div className="pt-3 border-t border-purple-200">
                    <p className="text-sm text-gray-600">Session Cost</p>
                    <p className="text-2xl font-bold text-purple-600">{therapist.price}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                View Dashboard
              </button>
              <button
                onClick={() => navigate('/therapists')}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Book Another Session
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/therapists')}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Therapists
        </button>

        {/* Therapist Profile */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-start gap-6">
            <img
              src={therapist.image}
              alt={therapist.name}
              className="w-24 h-24 rounded-full border-4 border-purple-100"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {therapist.name}
              </h1>
              <p className="text-purple-600 font-semibold mb-2">
                {therapist.specialization}
              </p>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 font-semibold text-gray-700">
                    {therapist.rating} ({therapist.reviews} reviews)
                  </span>
                </div>
                <span className={`font-bold text-lg ${therapist.priceAmount === 0 ? 'text-teal-600' : 'text-gray-800'}`}>
                  {therapist.price}
                </span>
              </div>
              <p className="text-gray-600">{therapist.bio}</p>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleBooking} className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Schedule Your Session
          </h2>

          {/* Session Type */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-3">
              Session Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSessionType('video')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  sessionType === 'video'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <Video className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <p className="font-semibold text-gray-800">Video Call</p>
                <p className="text-sm text-gray-600">Online session</p>
              </button>
              <button
                type="button"
                onClick={() => setSessionType('in-person')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  sessionType === 'in-person'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <MapPin className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <p className="font-semibold text-gray-800">In-Person</p>
                <p className="text-sm text-gray-600">Office visit</p>
              </button>
            </div>
          </div>

          {/* Date Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Select Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Time Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-3">
              Select Time
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`py-2 px-3 rounded-lg border-2 transition-all text-sm ${
                    selectedTime === time
                      ? 'border-purple-500 bg-purple-500 text-white'
                      : 'border-gray-200 hover:border-purple-300 text-gray-700'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              placeholder="Share anything you'd like your therapist to know before the session..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedDate || !selectedTime}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
              selectedDate && selectedTime
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-1'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Confirm Booking
          </button>
          
          {therapist.priceAmount === 0 && (
            <p className="mt-4 text-center text-teal-600 font-semibold">
              ✨ This is a free session - no payment required
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default BookingPage;
