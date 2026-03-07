import { useState, useEffect } from 'react'
import { Phone, Shield, Leaf, AlertTriangle, MessageCircle, ChevronRight, ExternalLink, Loader } from 'lucide-react'
import { supportAPI, aiAPI } from '../api/services'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'

const mockResources = [
  { id: '1', name: 'Suicide & Crisis Lifeline', phone: '988', category: 'Crisis' },
  { id: '2', name: 'Crisis Text Line', phone: 'Text HOME to 741741', category: 'Crisis' },
  { id: '3', name: 'Domestic Violence Hotline', phone: '1-800-799-SAFE', category: 'Safety' },
  { id: '4', name: 'RAINN Sexual Assault Hotline', phone: '1-800-656-HOPE', category: 'Safety' },
  { id: '5', name: 'Substance Abuse Helpline', phone: '1-800-662-HELP', category: 'Substance' },
  { id: '6', name: 'Eating Disorders Helpline', phone: '1-800-931-2237', category: 'Eating' },
]

const CATEGORY_META = {
  Crisis:    { color: '#EF4444', bg: '#FEF2F2', label: 'Crisis Support' },
  Safety:    { color: '#C17A55', bg: '#FDF6F0', label: 'Safety & Abuse' },
  Substance: { color: '#4A5E3A', bg: '#E8EDE0', label: 'Substance Support' },
  Eating:    { color: '#6B7F5E', bg: '#EFF5E8', label: 'Eating Disorders' },
}

function FreeHelpPage() {
  const { isAuthenticated } = useAuth()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi, I'm here to listen. How are you feeling today?" }
  ])
  const [input, setInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [emergency, setEmergency] = useState(false)

  useEffect(() => {
    supportAPI.getAll()
      .then(r => setResources(r.data.data.resources || r.data.data || []))
      .catch(() => setResources(mockResources))
      .finally(() => setLoading(false))
  }, [])

  const grouped = resources.reduce((acc, r) => {
    const cat = r.category || 'General'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(r)
    return acc
  }, {})

  const sendMessage = async () => {
    if (!input.trim() || aiLoading) return
    if (!isAuthenticated) { setShowAuth(true); return }
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setAiLoading(true)
    try {
      const r = await aiAPI.chat(userMsg)
      const { reply, isEmergency } = r.data.data
      if (isEmergency) setEmergency(true)
      setMessages(prev => [...prev, { role: 'ai', text: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: "I'm having trouble connecting right now. If you're in crisis, please call 988 immediately." }])
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#F7F4EF' }}>
      {/* Hero */}
      <div className="py-16 px-4" style={{ background: 'linear-gradient(135deg, #2C3E1E, #4A5E3A)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'rgba(255,255,255,0.12)', color: '#A3C17A' }}>
            <Shield className="w-4 h-4" /> Free & confidential support
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            You are not alone
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Free, confidential support is always available. Below you'll find crisis hotlines, 
            support resources, and our AI companion to talk through how you're feeling.
          </p>

          {/* Emergency banner */}
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl border text-left"
            style={{ background: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.4)' }}>
            <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: '#EF4444' }} />
            <div>
              <p className="font-bold text-white text-sm">In immediate danger?</p>
              <p className="text-white/70 text-xs">Call 911 or go to your nearest emergency room now</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">

        {/* 24/7 Crisis row */}
        <section>
          <h2 className="text-xl font-bold mb-5" style={{ color: '#2C3E1E' }}>24/7 Crisis Hotlines</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: 'Suicide & Crisis Lifeline', number: '988', desc: 'Call or text anytime' },
              { name: 'Crisis Text Line', number: 'Text HOME to 741741', desc: 'Anonymous text support' },
              { name: 'Domestic Violence', number: '1-800-799-SAFE', desc: '24/7 safety support' },
            ].map((h, i) => (
              <div key={i} className="rounded-2xl p-6 flex flex-col gap-2"
                style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)' }}>
                <Phone className="w-6 h-6 text-white/80" />
                <p className="text-white font-semibold text-sm">{h.name}</p>
                <a href={`tel:${h.number.replace(/\D/g,'')}`}
                  className="text-white text-2xl font-bold hover:opacity-80">{h.number}</a>
                <p className="text-white/60 text-xs">{h.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* All resources grouped */}
        <section>
          <h2 className="text-xl font-bold mb-5" style={{ color: '#2C3E1E' }}>Support Resources</h2>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader className="w-6 h-6 animate-spin" style={{ color: '#6B7F5E' }} />
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(grouped).map(([cat, items]) => {
                const meta = CATEGORY_META[cat] || { color: '#6B7F5E', bg: '#E8EDE0', label: cat }
                return (
                  <div key={cat}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold px-3 py-1 rounded-full"
                        style={{ background: meta.bg, color: meta.color }}>
                        {meta.label}
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {items.map(r => (
                        <div key={r.id} className="flex items-center gap-4 rounded-2xl border p-4"
                          style={{ background: '#fff', borderColor: '#E8EDE0' }}>
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: meta.bg }}>
                            <Phone className="w-4 h-4" style={{ color: meta.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate" style={{ color: '#2C3E1E' }}>{r.name}</p>
                            <p className="text-xs font-medium mt-0.5" style={{ color: meta.color }}>{r.phone}</p>
                          </div>
                          {r.website && (
                            <a href={r.website} target="_blank" rel="noreferrer"
                              className="flex-shrink-0 opacity-40 hover:opacity-80">
                              <ExternalLink className="w-4 h-4" style={{ color: '#4A5E3A' }} />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* AI Chat section */}
        <section>
          <div className="rounded-3xl overflow-hidden border" style={{ borderColor: '#E8EDE0' }}>
            {/* Header */}
            <div className="p-6 flex items-center justify-between cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #2C3E1E, #4A5E3A)' }}
              onClick={() => setChatOpen(o => !o)}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(163,193,122,0.2)' }}>
                  <MessageCircle className="w-5 h-5" style={{ color: '#A3C17A' }} />
                </div>
                <div>
                  <p className="font-bold text-white">Talk to our AI Companion</p>
                  <p className="text-xs text-white/60">Private, judgment-free support anytime</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-white/60 transition-transform ${chatOpen ? 'rotate-90' : ''}`} />
            </div>

            {chatOpen && (
              <div style={{ background: '#fff' }}>
                {emergency && (
                  <div className="flex items-center gap-3 px-4 py-3 text-sm font-semibold"
                    style={{ background: '#FEF2F2', color: '#EF4444' }}>
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    Crisis detected — please call 988 or text HOME to 741741
                  </div>
                )}
                {/* Messages */}
                <div className="h-72 overflow-y-auto p-4 space-y-3">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className="max-w-xs px-4 py-2.5 rounded-2xl text-sm"
                        style={m.role === 'user'
                          ? { background: '#4A5E3A', color: '#fff', borderBottomRightRadius: 4 }
                          : { background: '#E8EDE0', color: '#2C3E1E', borderBottomLeftRadius: 4 }}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="flex justify-start">
                      <div className="px-4 py-3 rounded-2xl" style={{ background: '#E8EDE0' }}>
                        <Loader className="w-4 h-4 animate-spin" style={{ color: '#6B7F5E' }} />
                      </div>
                    </div>
                  )}
                </div>
                {/* Input */}
                <div className="flex items-center gap-3 p-4 border-t" style={{ borderColor: '#E8EDE0' }}>
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder={isAuthenticated ? "Share how you're feeling…" : "Sign in to chat with our AI…"}
                    className="flex-1 text-sm rounded-full px-4 py-2.5 outline-none border"
                    style={{ background: '#F7F4EF', borderColor: '#E8EDE0', color: '#2C3E1E' }}
                  />
                  <button onClick={sendMessage}
                    disabled={!input.trim() || aiLoading}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity disabled:opacity-40"
                    style={{ background: '#4A5E3A' }}>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>
                {!isAuthenticated && (
                  <div className="px-4 pb-4 text-center">
                    <button onClick={() => setShowAuth(true)}
                      className="text-xs font-semibold underline" style={{ color: '#4A5E3A' }}>
                      Sign in to use the AI companion
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Bottom reassurance */}
        <section className="text-center py-8">
          <Leaf className="w-8 h-8 mx-auto mb-3 opacity-30" style={{ color: '#4A5E3A' }} />
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            All resources listed are free of charge. Your privacy matters — 
            we never share your information with anyone.
          </p>
        </section>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}

export default FreeHelpPage

       