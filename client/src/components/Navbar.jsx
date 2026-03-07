import { Link, useLocation } from 'react-router-dom'
import { Leaf, Menu, X, Calendar, Users, Home, BookOpen, Shield, User, LogOut, ChevronDown, ShieldCheck, MessageCircle, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'
import ThemeToggle from './ThemeToggle'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const location = useLocation()

  const getFirstLink = () => {
    if (!isAuthenticated) return { to: '/', label: 'Home', icon: Home }
    if (user?.role === 'doctor' || user?.role === 'spiritual_leader') return { to: '/doctor', label: 'My Schedule', icon: Calendar }
    if (user?.role === 'admin') return { to: '/admin', label: 'Admin Panel', icon: ShieldCheck }
    return { to: '/dashboard', label: 'My Dashboard', icon: Calendar }
  }

  const navLinks = [
    getFirstLink(),
    ...(user?.role === 'doctor' || user?.role === 'admin' || user?.role === 'spiritual_leader' ? [] : [
      { to: '/therapists', label: 'Therapists', icon: Users },
      { to: '/challenges', label: 'Challenges', icon: BookOpen },
      { to: '/free-help', label: 'Free Help', icon: Shield },
    ]),
    { to: '/chat', label: 'Chat', icon: MessageCircle },
    { to: '/ai-assistant', label: 'AI Assistant', icon: Sparkles },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-accent/20 bg-base-bg text-base-text transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
                <Leaf className="w-4 h-4 text-primary-inverse" />
              </div>
              <span className="text-xl font-bold tracking-tight text-base-text">
                Her<span className="text-primary">Space</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? 'bg-primary text-primary-inverse'
                      : 'text-base-text opacity-80 hover:opacity-100 hover:bg-accent/10'
                  }`}>
                  <link.icon className="w-3.5 h-3.5" />
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              {isAuthenticated ? (
                <>
                  <div className="relative">
                    <button onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-3 py-2 rounded-full border border-accent/20 bg-base-bg transition-all hover:shadow-sm">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-primary-inverse text-xs font-bold bg-primary">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="text-sm font-medium opacity-90">{user?.name?.split(' ')[0]}</span>
                      <ChevronDown className="w-3 h-3 opacity-60" />
                    </button>
                    {showUserMenu && (
                      <div className="absolute right-0 top-12 rounded-2xl shadow-xl border border-accent/20 py-2 w-48 z-50 bg-base-bg text-base-text">
                        <div className="px-4 py-2 border-b border-accent/20">
                          <p className="text-xs opacity-60">Signed in as</p>
                          <p className="text-sm font-semibold truncate">{user?.email}</p>
                        </div>
                        <Link to={user?.role === 'doctor' ? '/doctor' : user?.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-accent/10 transition-colors">
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        <button onClick={() => { logout(); setShowUserMenu(false) }}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 w-full text-left transition-colors">
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button onClick={() => setShowAuth(true)}
                    className="text-sm font-medium px-4 py-2 rounded-full transition-colors opacity-90 hover:opacity-100 hover:bg-accent/10 text-primary">
                    Sign In
                  </button>
                  <button onClick={() => setShowAuth(true)}
                    className="text-sm font-semibold px-5 py-2 rounded-full text-primary-inverse transition-all hover:shadow-md bg-gradient-to-br from-primary to-secondary">
                    Get Started
                  </button>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl transition-colors hover:bg-accent/10 text-primary">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t px-4 py-4 space-y-1 border-accent/20 bg-base-bg text-base-text">
            <div className="flex justify-end p-2"><ThemeToggle /></div>
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.to) ? 'bg-primary text-primary-inverse' : 'opacity-80 hover:opacity-100 hover:bg-accent/10'
                }`}>
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t mt-2 border-accent/20">
              {isAuthenticated ? (
                <>
                  <button onClick={() => { logout(); setIsOpen(false) }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 w-full text-left">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <button onClick={() => { setShowAuth(true); setIsOpen(false) }}
                  className="w-full py-3 rounded-xl text-sm font-semibold text-primary-inverse bg-gradient-to-br from-primary to-secondary">
                  Sign In / Get Started
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}

export default Navbar

