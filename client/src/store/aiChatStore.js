import { create } from 'zustand'
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
