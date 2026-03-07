import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storeCode = \import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const defaultMessage = { role: 'ai', text: "Hi, I'm your AI companion. How are you feeling today? I'm here to listen without judgment." };

const useAIChatStore = create(
  persist(
    (set) => ({
      sessions: [
        { id: 'default', title: 'New Chat', messages: [defaultMessage], updatedAt: Date.now() }
      ],
      activeSessionId: 'default',

      addMessage: (message) => set((state) => {
        const sessions = state.sessions.map(s => {
          if (s.id === state.activeSessionId) {
            const isFirstUserMsg = s.messages.length === 1 && message.role === 'user';
            return {
              ...s,
              messages: [...s.messages, message],
              title: isFirstUserMsg ? message.text.slice(0, 25) + (message.text.length > 25 ? '...' : '') : s.title,
              updatedAt: Date.now()
            };
          }
          return s;
        });
        return { sessions };
      }),

      createNewChat: () => set((state) => {
        const newId = Date.now().toString();
        return {
          sessions: [{ id: newId, title: 'New Chat', messages: [defaultMessage], updatedAt: Date.now() }, ...state.sessions],
          activeSessionId: newId
        };
      }),

      setActiveSession: (id) => set({ activeSessionId: id }),

      deleteChat: (id) => set((state) => {
        const remaining = state.sessions.filter(s => s.id !== id);
        if (remaining.length === 0) {
          const newId = Date.now().toString();
          return {
             sessions: [{ id: newId, title: 'New Chat', messages: [defaultMessage], updatedAt: Date.now() }],
             activeSessionId: newId
          }
        }
        return {
          sessions: remaining,
          activeSessionId: state.activeSessionId === id ? remaining[0].id : state.activeSessionId
        };
      }),
    }),
    {
      name: 'ai-chat-history',
    }
  )
)

export default useAIChatStore
\;

const pageCode = \import { useState, useRef, useEffect } from 'react'
import { Sparkles, SendHorizonal, Loader, Heart, Leaf, AlertTriangle, Trash2, Plus, MessageSquare, Menu, X } from 'lucide-react'
import { aiAPI } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import AuthModal from '../components/AuthModal'
import ReactMarkdown from 'react-markdown'
import useAIChatStore from '../store/aiChatStore'

export default function AIAssistantPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const { sessions, activeSessionId, addMessage, createNewChat, setActiveSession, deleteChat } = useAIChatStore()
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0]
  const messages = activeSession?.messages || []
  
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [emergency, setEmergency] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return

    if (!isAuthenticated) {
      setShowAuth(true)
      return
    }

    const userMsg = input.trim()
    setInput('')
    addMessage({ role: 'user', text: userMsg })
    setLoading(true)

    try {
      const r = await aiAPI.chat(userMsg)
      const { reply, isEmergency } = r.data.data || r.data
      if (isEmergency) setEmergency(true)
      addMessage({ role: 'ai', text: reply })
    } catch {
      addMessage({
        role: 'ai',
        text: "I'm having trouble connecting right now. If you're in crisis, please call 988 immediately.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-base-bg text-base-text overflow-hidden relative">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="absolute inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className="\\bsolute inset-y-0 left-0 z-50 w-72 bg-base-bg border-r border-accent/20 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 \\\\\">
        <div className="p-4 border-b border-accent/20 flex items-center justify-between">
          <button 
            onClick={() => { createNewChat(); setIsSidebarOpen(false); }}
            className="flex-1 py-2.5 rounded-xl border border-accent/20 flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-inverse transition-colors font-medium text-sm"
          >
            <Plus className="w-4 h-4" /> New Chat
          </button>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden ml-3 p-2 text-base-text opacity-70">
            <X className="w-5 h-5"/>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          <div className="text-xs font-semibold px-2 mb-2 pt-2 opacity-50 uppercase tracking-wider">Recent Chats</div>
          {sessions.map(s => (
            <div 
              key={s.id} 
              className="\\group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors \\\\\" 
              onClick={() => { setActiveSession(s.id); setIsSidebarOpen(false); }}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare className="w-4 h-4 flex-shrink-0 opacity-70" />
                <span className="text-sm truncate opacity-90 font-medium">{s.title}</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteChat(s.id); }} 
                className="opacity-0 md:group-hover:opacity-100 md:opacity-0 opacity-100 p-1 hover:text-red-500 transition-opacity"
                title="Delete Chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-base-bg min-w-0 relative">
        
        {/* Header (shows on mobile) */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-accent/20 bg-base-bg absolute top-0 left-0 right-0 z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-primary">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-semibold text-sm">AI Companion</span>
          <div className="w-6" />
        </div>

        {/* Emergency Ribbon */}
        {emergency && (
          <div className="mt-14 md:mt-0 px-6 py-3 flex items-center gap-3 text-sm font-semibold border-b bg-red-50 text-red-600 border-red-200 shrink-0">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p>
              Crisis detected — please call <strong>988</strong> or text <strong>HOME to 741741</strong> for immediate help.
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="\\lex-1 overflow-y-auto px-4 py-6 md:py-8 space-y-6 \\\ custom-scrollbar\\">
          {messages.length === 1 && (
            <div className="flex flex-col items-center justify-center h-full opacity-60 text-center px-4">
              <Sparkles className="w-12 h-12 mb-4 text-primary opacity-50" />
              <h2 className="text-xl font-bold mb-2">How can I support you today?</h2>
              <p className="text-sm max-w-md">I am your private, safe space. Your chats are saved locally so you can pick up right where you left off.</p>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className="\\lex \\\ max-w-4xl mx-auto w-full group\\">
              {m.role === 'ai' && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 bg-accent/20">
                  <Heart className="w-4 h-4 text-primary" />
                </div>
              )}
              <div
                className="\\max-w-[85%] md:max-w-[75%] px-5 py-3.5 rounded-2xl text-sm md:text-base leading-relaxed whitespace-pre-wrap shadow-sm \\\\\"
              >
                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                    li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                    em: ({ node, ...props }) => <em className="italic" {...props} />,
                  }}
                >
                  {m.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start max-w-4xl mx-auto w-full">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 bg-accent/20">
                <Heart className="w-4 h-4 text-primary" />
              </div>
              <div className="px-5 py-4 rounded-2xl rounded-bl-sm bg-accent/10 border border-accent/20 flex flex-col gap-1 items-center justify-center h-[52px]">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} className="h-1 pb-4" />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-base-bg border-t border-accent/20 shrink-0">
          <div className="max-w-4xl mx-auto relative flex items-center group">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isAuthenticated ? "Share how you're feeling…" : 'Sign in to chat…'}
              disabled={loading}
              className="w-full pl-6 pr-14 py-4 rounded-3xl outline-none border focus:border-primary transition-colors text-sm md:text-base shadow-sm disabled:opacity-70 bg-base-bg text-base-text border-accent/30"
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || loading}
              className="absolute right-2 w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-40 disabled:bg-transparent disabled:text-base-text/40 bg-primary text-primary-inverse shadow-sm hover:scale-105"
            >
              <SendHorizonal className="w-5 h-5 ml-0.5" />
            </button>
          </div>
          <p className="text-center text-xs opacity-50 mt-3 hidden md:block">
            AI can make mistakes. For clinical diagnosis or emergencies, please reach out to professional therapists or hotlines.
          </p>
        </div>
        
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}
\;

fs.writeFileSync(path.join(__dirname, 'src', 'store', 'aiChatStore.js'), storeCode);
fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'AIAssistantPage.jsx'), pageCode.replace(/\\\\\\/g, '\').replace(/\\\\\\\$/g, '\$'));

console.log('UI updated');
