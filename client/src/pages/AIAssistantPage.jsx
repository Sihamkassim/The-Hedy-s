import { useState } from 'react'
import { Sparkles, SendHorizonal, Loader, Heart, Leaf, AlertTriangle } from 'lucide-react'
import { aiAPI } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import AuthModal from '../components/AuthModal'

export default function AIAssistantPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi, I'm your AI companion. How are you feeling today? I'm here to listen without judgment." },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [emergency, setEmergency] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    if (!isAuthenticated) {
      setShowAuth(true)
      return
    }

    const userMsg = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)

    try {
      const r = await aiAPI.chat(userMsg)
      const { reply, isEmergency } = r.data.data || r.data
      if (isEmergency) setEmergency(true)
      setMessages((prev) => [...prev, { role: 'ai', text: reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: "I'm having trouble connecting right now. If you're in crisis, please call 988 immediately.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F4EF' }}>
      {/* Hero */}
      <div className="py-10 px-4" style={{ background: 'linear-gradient(135deg, #2C3E1E, #4A5E3A)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(255,255,255,0.12)', color: '#A3C17A' }}
          >
            <Sparkles className="w-4 h-4" /> AI Mental Health Support
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Your AI Companion</h1>
          <p className="text-white/:70 text-lg max-w-xl mx-auto">
            A safe space to share your thoughts and feelings. Always here, always listening.
          </p>
        </div>
      </div>

      {emergency && (
        <div
          className="px-6 py-4 flex items-center gap-3 text-sm font-semibold border-b"
          style={{ background: '#FEF2F2', color: '#EF4444', borderColor: '#FECACA' }}
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p>
            Crisis detected — please call <strong>988</strong> or text <strong>HOME to 741741</strong> for immediate help.
          </p>
        </div>
      )}

      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">
        <div className="bg-white rounded-3xl shadow-sm border h-full flex flex-col" style={{ borderColor: '#E8EDE0' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'ai' && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                    style={{ background: '#E8EDE0' }}
                  >
                    <Heart className="w-4 h-4" style={{ color: '#4A5E3A' }} />
                  </div>
                )}
                <div
                  className="max-w-md px-5 py-3 rounded-2xl text-sm leading-relaxed"
                  style={
                    m.role === 'user'
                      ? { background: '#4A5E3A', color: '#fff', borderBottomRightRadius: 4 }
                      : { background: '#E8EDE0', color: '#2C3E1E', borderBottomLeftRadius: 4 }
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-5 py-3 rounded-2xl" style={{ background: '#E8EDE0' }}>
                  <Loader className="w-4 h-4 animate-spin" style={{ color: '#6B7F5E' }} />
                </div>
              </div>
            )}
            {!isAuthenticated && messages.length > 1 && (
              <div className="text-center py-6">
                <button
                  onClick={() => setShowAuth(true)}
                  className="px-6 py-2.5 rounded-full text-sm font-semibold text-white"
                  style={{ background: '#4A5E3A' }}
                >
                  Sign in to continue chatting
                </button>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t flex items-center gap-3" style={{ borderColor: '#E8EDE0' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={isAuthenticated ? "Share how you're feeling…" : 'Sign in to chat with the AI…'}
              className="flex-1 px-4 py-3 rounded-full outline-none border text-sm"
              style={{ background: '#F7F4EF', borderColor: '#E8EDE0' }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-40"
              style={{ background: '#4A5E3A' }}
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin text-white" />
              ) : (
                <SendHorizonal className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom reassurance */}
      <div className="text-center py-8 px-4">
        <Leaf className="w-6 h-6 mx-auto mb-2 opacity-30" style={{ color: '#4A5E3A' }} />
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          This AI is trained on mental wellness principles but is not a substitute for professional therapy. If you're in crisis, call 988.
        </p>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}
