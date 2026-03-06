import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-purple-50 to-teal-50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-8 h-8 text-purple-500 fill-purple-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-teal-500 bg-clip-text text-transparent">
                HerSpace
              </span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              A safe, supportive space for women's mental health and personal growth. 
              We're here to help you thrive, heal, and grow.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>24/7 Crisis: 988</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>support@herspace.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/therapists" className="text-gray-600 hover:text-purple-500 transition-colors">
                  Find a Therapist
                </Link>
              </li>
              <li>
                <Link to="/challenges" className="text-gray-600 hover:text-purple-500 transition-colors">
                  Join Challenges
                </Link>
              </li>
              <li>
                <Link to="/free-help" className="text-gray-600 hover:text-purple-500 transition-colors">
                  Free Support
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-purple-500 transition-colors">
                  My Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Emergency Help</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-600">
                <strong className="text-purple-600">Suicide & Crisis:</strong><br />
                988 Lifeline
              </li>
              <li className="text-gray-600">
                <strong className="text-teal-600">Domestic Violence:</strong><br />
                1-800-799-SAFE
              </li>
              <li className="text-gray-600">
                <strong className="text-pink-600">Substance Abuse:</strong><br />
                1-800-662-HELP
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600 text-sm">
          <p>&copy; 2026 HerSpace. All rights reserved. Your mental health matters. 💜</p>
          <p className="mt-2 text-xs">
            If you're in crisis, please call 988 or go to your nearest emergency room.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
