import { Link } from 'react-router-dom';
import { Heart, Shield, Users, Sparkles, ArrowRight, Star, CheckCircle } from 'lucide-react';
import TherapistCard from '../components/TherapistCard';
import ChallengeCard from '../components/ChallengeCard';
import { therapists, challenges, testimonials } from '../data/mockData';

function LandingPage() {
  const featuredTherapists = therapists.slice(0, 3);
  const featuredChallenges = challenges.slice(0, 2);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-500 via-pink-400 to-teal-400 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <Heart className="w-20 h-20 animate-pulse fill-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Your Mental Health Journey Starts Here
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              A safe, supportive space for women to heal, grow, and thrive. 
              Professional therapy, life coaching, and personal development—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/therapists"
                className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Find a Therapist
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/free-help"
                className="bg-teal-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Get Free Support
                <Shield className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Your Mental Health Matters
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We believe every woman deserves access to quality mental health support, 
              regardless of her circumstances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors duration-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Expert Therapists & Coaches
              </h3>
              <p className="text-gray-600">
                Connect with licensed therapists and certified life coaches who understand your journey.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-xl bg-teal-50 hover:bg-teal-100 transition-colors duration-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500 rounded-full mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Free Crisis Support
              </h3>
              <p className="text-gray-600">
                24/7 access to free counseling for crises, abuse recovery, and emotional emergencies.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-xl bg-pink-50 hover:bg-pink-100 transition-colors duration-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-500 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Personal Growth Challenges
              </h3>
              <p className="text-gray-600">
                Join 30-day challenges to build confidence, reduce anxiety, and develop self-love.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Why Choose HerSpace?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-teal-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Safe & Confidential</h4>
                    <p className="text-gray-600">Your privacy is our priority. All sessions are completely confidential.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Accessible & Affordable</h4>
                    <p className="text-gray-600">Free support for critical needs, affordable options for ongoing care.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Trauma-Informed Care</h4>
                    <p className="text-gray-600">Our therapists specialize in women's mental health and trauma recovery.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-teal-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Holistic Approach</h4>
                    <p className="text-gray-600">Therapy, coaching, and self-improvement tools all in one platform.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Always Free Support For:
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3 p-3 bg-teal-50 rounded-lg">
                  <Shield className="w-6 h-6 text-teal-600" />
                  <span className="font-semibold text-gray-800">Drug Abuse Recovery</span>
                </li>
                <li className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Shield className="w-6 h-6 text-purple-600" />
                  <span className="font-semibold text-gray-800">Gender-Based Violence Support</span>
                </li>
                <li className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
                  <Shield className="w-6 h-6 text-pink-600" />
                  <span className="font-semibold text-gray-800">Emotional Crisis Counseling</span>
                </li>
              </ul>
              <Link
                to="/free-help"
                className="mt-6 block w-full text-center bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Access Free Support Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Therapists */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Meet Our Therapists & Coaches
            </h2>
            <p className="text-xl text-gray-600">
              Compassionate professionals ready to support your journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {featuredTherapists.map((therapist) => (
              <TherapistCard key={therapist.id} therapist={therapist} />
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/therapists"
              className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 text-lg"
            >
              View All Therapists
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Challenges */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Transform Your Life in 30 Days
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of women on their personal growth journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {featuredChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/challenges"
              className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 text-lg"
            >
              Explore All Challenges
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Stories of Hope & Healing
            </h2>
            <p className="text-xl text-gray-600">
              Real experiences from our community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl shadow-md"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold text-purple-600">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-pink-500 to-teal-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Healing Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            You don't have to face this alone. We're here for you, every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/therapists"
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Book Your First Session
            </Link>
            <Link
              to="/dashboard"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Go to Dashboard
            </Link>
          </div>
          <p className="mt-8 text-white/80 text-sm">
            Crisis? Call 988 for immediate support • Available 24/7
          </p>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
