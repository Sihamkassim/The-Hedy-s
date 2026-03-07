import api from './axios'

export const authAPI = {
  register: (data) => {
    // Let Axios automatically handle the boundary for FormData
    return api.post('/auth/register', data)
  },
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
}

export const therapistAPI = {
  getAll: (params) => api.get('/therapists', { params }),
  getOne: (id) => api.get(`/therapists/${id}`),
  acceptTerms: () => api.post('/therapists/accept-terms'),
  // Admin only
  create: (data) => api.post('/therapists', data),
  update: (id, data) => api.patch(`/therapists/${id}`, data),
  delete: (id) => api.delete(`/therapists/${id}`),
}

export const appointmentAPI = {
  create: (data) => api.post('/appointments', data),
  getMyAppointments: () => api.get('/appointments/my-appointments'),
  getOne: (id) => api.get(`/appointments/${id}`),
  cancel: (id) => api.patch(`/appointments/${id}/cancel`),
  // Admin / Doctor only
  getAll: () => api.get('/appointments'),
  updateStatus: (id, status) => api.patch(`/appointments/${id}`, { status }),
}

export const challengeAPI = {
  getAll: () => api.get('/challenges'),
  getOne: (id) => api.get(`/challenges/${id}`),
  join: (id) => api.post(`/challenges/${id}/join`),
  updateProgress: (id, data) => api.patch(`/challenges/${id}/progress`, data),
  getMyProgress: () => api.get('/challenges/my/progress'),
  // Admin only
  create: (data) => api.post('/challenges', data),
  update: (id, data) => api.patch(`/challenges/${id}`, data),
  delete: (id) => api.delete(`/challenges/${id}`),
}

export const supportAPI = {
  getAll: (params) => api.get('/support', { params }),
  getOne: (id) => api.get(`/support/${id}`),
  // Admin only
  create: (data) => api.post('/support', data),
  delete: (id) => api.delete(`/support/${id}`),
}

export const aiAPI = {
  chat: (message) => api.post('/ai/chat', { message }),
}

export const chatAPI = {
  getContacts: () => api.get('/chat/contacts'),
  getMessagesWithUser: (userId) => api.get(`/chat/messages/${userId}`),
  sendMessage: (data) => api.post('/chat/messages', data),
  createVideoRoom: (data) => api.post('/chat/video-room', data),
}

// Doctor-specific endpoints
export const doctorAPI = {
  getMySchedule: () => api.get('/appointments/my-schedule'),
  updateAppointmentStatus: (id, status) => api.patch(`/appointments/${id}`, { status }),
}

// Admin-only endpoints
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  uploadDocument: (data) => api.post('/admin/documents', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getAllTherapists: (params) => api.get('/admin/therapists', { params }),
  updateTherapistStatus: (id, status) => api.patch(`/admin/therapists/${id}/status`, { status })
}
