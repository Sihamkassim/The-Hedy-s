import { useState, useEffect, useRef } from 'react'
import { MessageCircle, SendHorizonal, Loader, User, Search, AlertCircle, Video } from 'lucide-react'
import { chatAPI } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import VideoCallModal from '../components/VideoCallModal'

export default function ChatPage() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [contacts, setContacts] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [socket, setSocket] = useState(null)
  const [videoRoomUrl, setVideoRoomUrl] = useState(null)
  const [creatingCall, setCreatingCall] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
      return
    }

    const newSocket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000')
    setSocket(newSocket)

    chatAPI
      .getContacts()
      .then((r) => setContacts(r.data.data.contacts || []))
      .catch(() => setContacts([]))
      .finally(() => setLoading(false))

    return () => {
      newSocket?.disconnect?.()
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (!socket || !user || !selectedContact) return

    const roomId = [user.id, selectedContact.id].sort().join('-')
    socket.emit('join_room', roomId)

    socket.on('receive_message', (msg) => {
      if (msg.senderId === selectedContact.id || msg.receiverId === selectedContact.id) {
        setMessages((prev) => [...prev, msg])
      }
    })

    return () => {
      socket.off('receive_message')
    }
  }, [socket, user, selectedContact])

  useEffect(() => {
    if (!selectedContact) return
    chatAPI
      .getMessagesWithUser(selectedContact.id)
      .then((r) => setMessages(r.data.data.messages || []))
      .catch(() => setMessages([]))
  }, [selectedContact])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || sending || !selectedContact) return

    const text = input.trim()
    setInput('')
    setSending(true)

    try {
      await chatAPI.sendMessage({ receiverId: selectedContact.id, message: text })

      if (socket && user) {
        const roomId = [user.id, selectedContact.id].sort().join('-')
        socket.emit('send_message', {
          roomId,
          senderId: user.id,
          receiverId: selectedContact.id,
          message: text,
        })
      }
    } catch {}
    setSending(false)
  }

  const handleStartVideoCall = async () => {
    if (!selectedContact || creatingCall) return
    setCreatingCall(true)

    try {
      const res = await chatAPI.createVideoRoom({ receiverId: selectedContact.id })
      if (res.data.data.roomUrl) {
        const callLink = `[VIDEO_CALL]: ${res.data.data.roomUrl}`
        await chatAPI.sendMessage({ receiverId: selectedContact.id, message: callLink })

        if (socket && user) {
          const roomId = [user.id, selectedContact.id].sort().join('-')
          socket.emit('send_message', {
            roomId,
            senderId: user.id,
            receiverId: selectedContact.id,
            message: callLink,
          })
        }
        setVideoRoomUrl(res.data.data.roomUrl)
      }
    } catch (err) {
      console.error('Failed to create video call', err)
    } finally {
      setCreatingCall(false)
    }
  }

  const filteredContacts = contacts.filter((c) =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--base-bg)' }}>
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col" style={{ borderColor: '#D4DBC8', background: '#fff' }}>
        <div className="p-4 border-b" style={{ borderColor: 'color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)' }}>
          <h1 className="text-xl font-bold mb-3" style={{ color: 'var(--base-text)' }}>
            Messages
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts..."
              className="w-full pl-10 pr-4 py-2 rounded-full border text-sm outline-none"
              style={{ background: 'var(--base-bg)', borderColor: 'color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)' }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader className="w-5 h-5 animate-spin" style={{ color: 'var(--primary)' }} />
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-6 text-center">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-30" style={{ color: 'var(--primary)' }} />
              <p className="text-sm text-gray-400">No contacts yet</p>
            </div>
          ) : (
            filteredContacts.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedContact(c)}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-colors border-b ${
                  selectedContact?.id === c.id ? 'bg-[color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)]' : 'hover:bg-[var(--base-bg)]'
                }`}
                style={{ borderColor: 'color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-primary-inverse font-bold text-sm flex-shrink-0"
                  style={{ background: 'var(--primary)' }}
                >
                  {c.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: 'var(--base-text)' }}>
                    {c.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate capitalize">{c.role || 'User'}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col" style={{ background: '#fff' }}>
        {selectedContact ? (
          <>
            <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: 'color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)' }}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-primary-inverse font-bold text-sm"
                style={{ background: 'var(--primary)' }}
              >
                {selectedContact.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--base-text)' }}>
                  {selectedContact.name}
                </p>
                <p className="text-xs text-gray-400 capitalize">{selectedContact.role || 'User'}</p>
              </div>
              <div className="ml-auto">
                <button
                  onClick={handleStartVideoCall}
                  disabled={creatingCall}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-primary-inverse transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary))' }}
                >
                  {creatingCall ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Video className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">Start Video Call</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {messages.map((m, i) => {
                const isMe = m.senderId === user?.id
                const isVideoCall = m.message.startsWith('[VIDEO_CALL]: ')
                let displayMsg = m.message
                let callUrl = ''
                
                if (isVideoCall) {
                  callUrl = m.message.replace('[VIDEO_CALL]: ', '').trim()
                  displayMsg = isMe ? 'You started a video call.' : `${selectedContact.name} invited you to a video call.`
                }

                return (
                  <div key={m.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className="max-w-xs px-4 py-2.5 rounded-2xl text-sm break-words var(--base-bg)space-pre-wrap"
                      style={
                        isMe
                          ? { background: 'var(--primary)', color: '#fff', borderBottomRightRadius: 4 }       
                          : { background: 'color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)', color: 'var(--base-text)', borderBottomLeftRadius: 4 }     
                      }
                    >
                      {displayMsg}
                      {isVideoCall && (
                        <button
                          onClick={() => setVideoRoomUrl(callUrl)}
                          className="mt-2 block w-full text-center px-4 py-2 rounded-xl text-sm font-bold bg-base-bg/20 hover:bg-base-bg/30 transition-all border border-var(--base-bg)/30"
                          style={!isMe ? { background: 'var(--primary)', color: '#fff' } : { color: '#fff' }}
                        >
                          Join Call
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-6 py-4 border-t flex items-center gap-3" style={{ borderColor: 'color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)' }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 rounded-full outline-none border text-sm"
                style={{ background: 'var(--base-bg)', borderColor: 'color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-40"
                style={{ background: 'var(--primary)' }}
              >
                {sending ? (
                  <Loader className="w-4 h-4 animate-spin text-primary-inverse" />
                ) : (
                  <SendHorizonal className="w-4 h-4 text-primary-inverse" />
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: 'color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)' }}
            >
              <MessageCircle className="w-8 h-8" style={{ color: 'var(--primary)' }} />
            </div>
            <p className="text-lg font-semibold mb-1" style={{ color: 'var(--base-text)' }}>
              Select a conversation
            </p>
            <p className="text-sm text-gray-400 max-w-xs">
              Choose a contact from the sidebar to start messaging
            </p>
          </div>
        )}
      </div>

      {videoRoomUrl && (
        <VideoCallModal
          roomUrl={videoRoomUrl}
          onClose={() => setVideoRoomUrl(null)}
        />
      )}
    </div>
  )
}
