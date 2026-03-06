import { Shield, Phone, Heart, AlertCircle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { freeHelpResources, therapists } from '../data/mockData';

function FreeHelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-100 rounded-full mb-6">
            <Shield className="w-12 h-12 text-teal-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Free Support & Crisis Help
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            You are not alone. We provide free, confidential support for women in crisis. 
            All services below are completely free—no payment required, ever.
          </p>
          <div className="inline-flex items-center gap-3 bg-red-50 border-2 border-red-200 rounded-lg px-6 py-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div className="text-left">
              <p className="font-bold text-red-800">In immediate danger?</p>
              <p className="text-red-700">Call 911 or go to your nearest emergency room</p>
            </div>
          </div>
        </div>

        {/* Crisis Hotlines */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mb-12 text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-6 text-center">24/7 Crisis Hotlines</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-center">
              <Phone className="w-10 h-10 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Suicide & Crisis Lifeline</h3>
              <a href="tel:988" className="text-3xl font-bold hover:underline">988</a>
              <p className="text-sm mt-2 text-white/80">Available 24/7</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-center">
              <Phone className="w-10 h-10 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Domestic Violence Hotline</h3>
              <a href="tel:1-800-799-7233" className="text-2xl font-bold hover:underline">1-800-799-SAFE</a>
              <p className="text-sm mt-2 text-white/80">Available 24/7</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-center">
              <Phone className="w-10 h-10 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Substance Abuse Helpline</h3>
              <a href="tel:1-800-662-4357" className="text-2xl font-bold hover:underline">1-800-662-HELP</a>
              <p className="text-sm mt-2 text-white/80">Available 24/7</p>
            </div>
          </div>
        </div>

        {/* Free Support Categories */}
        <div className="space-y-8">
          {freeHelpResources.map((resource) => {
            const bgColors = {
              purple: 'from-purple-500 to-purple-600',
              teal: 'from-teal-500 to-teal-600',
              pink: 'from-pink-500 to-pink-600'
            };

            const lightColors = {
              purple: 'bg-purple-50',
              teal: 'bg-teal-50',
              pink: 'bg-pink-50'
            };

            const resourceTherapists = therapists.filter(t => resource.therapists.includes(t.id));

            return (
              <div key={resource.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className={`bg-gradient-to-r ${bgColors[resource.color]} p-6 text-white`}>
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{resource.icon}</div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold mb-2">{resource.title}</h2>
                      <p className="text-white/90 mb-3">{resource.description}</p>
                      <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
                        <Phone className="w-5 h-5" />
                        <span className="font-bold">{resource.emergencyNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Services */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">What We Offer:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {resource.services.map((service, index) => (
                        <div key={index} className={`${lightColors[resource.color]} p-3 rounded-lg flex items-start gap-2`}>
                          <Heart className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Available Therapists */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      <Users className="w-6 h-6 inline mr-2" />
                      Available Specialists:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {resourceTherapists.map((therapist) => (
                        <div key={therapist.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <img
                            src={therapist.image}
                            alt={therapist.name}
                            className="w-16 h-16 rounded-full border-2 border-purple-200"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{therapist.name}</h4>
                            <p className="text-sm text-gray-600">{therapist.specialization}</p>
                            <Link
                              to={`/booking/${therapist.id}`}
                              className="text-sm text-purple-600 hover:text-purple-700 font-semibold mt-1 inline-block"
                            >
                              Book Free Session →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Resources */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            How to Get Help
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Reach Out</h3>
              <p className="text-gray-600">
                Call a hotline, book a free session, or send us a message. All communications are confidential.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
                <span className="text-2xl font-bold text-teal-600">2</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Talk to a Specialist</h3>
              <p className="text-gray-600">
                Connect with trained therapists who specialize in your specific situation and needs.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
                <span className="text-2xl font-bold text-pink-600">3</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Start Healing</h3>
              <p className="text-gray-600">
                Get personalized support, resources, and a care plan tailored to your recovery journey.
              </p>
            </div>
          </div>
        </div>

        {/* Reassurance Section */}
        <div className="mt-12 text-center bg-gradient-to-r from-purple-500 to-teal-500 rounded-2xl p-12 text-white">
          <Heart className="w-16 h-16 mx-auto mb-6 fill-white" />
          <h2 className="text-3xl font-bold mb-4">You Are Not Alone</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-6">
            Every woman deserves support, safety, and healing. These services are free because 
            your wellbeing matters more than money. Reach out—we're here for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/therapists"
              className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
            >
              View All Therapists
            </Link>
            <a
              href="tel:988"
              className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-colors"
            >
              Call Crisis Line: 988
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreeHelpPage;
