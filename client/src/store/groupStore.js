import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useGroupStore = create(
  persist(
    (set) => ({
      groups: [
        { 
          id: '1', 
          name: 'Post-Pregnancy Support', 
          description: 'A safe space for new mothers.', 
          members: 120,
          messages: [
            { id: 'm1', senderId: 'admin', senderName: 'Dr. Sarah (Admin)', text: 'Welcome to the Post-Pregnancy Support group! Feel free to share your experiences here.', timestamp: new Date().toISOString() }
          ],
          isJoined: false
        },
        { 
          id: '2', 
          name: 'Teenage Struggles', 
          description: 'Navigate teenage challenges together.', 
          members: 85,
          messages: [
            { id: 'm1', senderId: 'admin', senderName: 'Therapist John', text: 'Hello everyone. This is a safe space for us to talk about our struggles.', timestamp: new Date().toISOString() }
          ],
          isJoined: false
        },
        { 
          id: '3', 
          name: 'Gender Abuse Survivors', 
          description: 'Support, healing, and community for survivors.', 
          members: 200,
          messages: [
            { id: 'm1', senderId: 'admin', senderName: 'Admin', text: 'You are not alone. Let us support each other.', timestamp: new Date().toISOString() }
          ],
          isJoined: false
        }
      ],
      addGroup: (group) => set((state) => ({ 
        groups: [...state.groups, { ...group, id: Date.now().toString(), members: 1, messages: [], isJoined: true }] 
      })),
      deleteGroup: (id) => set((state) => ({ 
        groups: state.groups.filter(g => g.id !== id) 
      })),
      addGroupMessage: (groupId, message) => set((state) => ({
        groups: state.groups.map(g => 
          g.id === groupId 
            ? { ...g, messages: [...(g.messages || []), message] }
            : g
        )
      })),
      joinGroup: (groupId) => set((state) => ({
        groups: state.groups.map(g =>
          g.id === groupId
            ? { ...g, isJoined: true, members: g.members + 1 }
            : g
        )
      }))
    }),
    { name: 'hedy-groups-storage' }
  )
)

export default useGroupStore