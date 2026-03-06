import { useState } from 'react';
import { Search, Filter, Star } from 'lucide-react';
import TherapistCard from '../components/TherapistCard';
import { therapists } from '../data/mockData';

function TherapistsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, free, paid
  const [filterSpecialization, setFilterSpecialization] = useState('all');

  // Get unique specializations
  const specializations = ['all', ...new Set(therapists.map(t => t.specialization))];

  // Filter therapists
  const filteredTherapists = therapists.filter(therapist => {
    const matchesSearch = therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapist.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' ? true :
                       filterType === 'free' ? therapist.priceAmount === 0 :
                       therapist.priceAmount > 0;
    
    const matchesSpecialization = filterSpecialization === 'all' ? true :
                                 therapist.specialization === filterSpecialization;

    return matchesSearch && matchesType && matchesSpecialization;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Find Your Therapist or Life Coach
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with compassionate professionals who understand your journey. 
            Free support available for crisis situations.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filter by Type */}
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Sessions</option>
                <option value="free">Free Support</option>
                <option value="paid">Paid Sessions</option>
              </select>
            </div>

            {/* Filter by Specialization */}
            <div>
              <select
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {specializations.map(spec => (
                  <option key={spec} value={spec}>
                    {spec === 'all' ? 'All Specializations' : spec}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-purple-600">{filteredTherapists.length}</span> therapist{filteredTherapists.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Therapist Grid */}
        {filteredTherapists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTherapists.map(therapist => (
              <TherapistCard key={therapist.id} therapist={therapist} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No therapists found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-8 text-white">
          <div className="flex items-start gap-4">
            <Star className="w-8 h-8 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold mb-2">Free Support Available</h3>
              <p className="text-white/90 mb-4">
                We provide free counseling for drug abuse recovery, gender-based violence support, 
                and emotional crisis situations. You never have to pay for help in a crisis.
              </p>
              <a href="/free-help" className="inline-block bg-white text-teal-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Learn More About Free Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TherapistsPage;
