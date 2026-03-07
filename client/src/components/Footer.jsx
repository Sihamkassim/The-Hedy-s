import { Leaf, Mail, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer style={{ backgroundColor: '#2C3E1E' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="w-7 h-7" style={{ color: '#A3C17A' }} />
              <span className="text-2xl font-bold text-white tracking-tight">Tsinat</span>
            </div>
            <p className="text-sm mb-6 max-w-sm leading-relaxed" style={{ color: '#8A9E6C' }}>
              A nurturing space for women's mental health and personal growth.
              Nature-inspired. Evidence-based. Always here for you.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2" style={{ color: '#8A9E6C' }}>
                <Phone className="w-4 h-4" />
                <span className="text-sm">24/7 Crisis Line: <strong className="text-white">988</strong></span>
              </div>
              <div className="flex items-center space-x-2" style={{ color: '#8A9E6C' }}>
                <Mail className="w-4 h-4" />
                <span className="text-sm">support@herspace.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Navigate</h3>
            <ul className="space-y-3">
              {[
                { to: '/therapists', label: 'Find a Therapist' },
                { to: '/challenges', label: 'Join Challenges' },
                { to: '/free-help', label: 'Free Support' },
                { to: '/dashboard', label: 'My Dashboard' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm transition-colors duration-200"
                    style={{ color: '#8A9E6C' }}
                    onMouseEnter={e => (e.target.style.color = '#A3C17A')}
                    onMouseLeave={e => (e.target.style.color = '#8A9E6C')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Crisis Resources */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Crisis Help</h3>
            <ul className="space-y-3 text-sm">
              <li style={{ color: '#8A9E6C' }}>
                <span className="text-white font-medium">Suicide & Crisis</span><br />
                988 Lifeline
              </li>
              <li style={{ color: '#8A9E6C' }}>
                <span className="text-white font-medium">Domestic Violence</span><br />
                1-800-799-SAFE
              </li>
              <li style={{ color: '#8A9E6C' }}>
                <span className="text-white font-medium">Substance Abuse</span><br />
                1-800-662-HELP
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 text-center text-xs" style={{ borderTop: '1px solid #4A5E3A', color: '#6B7F5E' }}>
          <p>&copy; 2026 HerSpace. All rights reserved. Your mental health matters.</p>
          <p className="mt-1">If you're in crisis, call 988 or go to your nearest emergency room.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
