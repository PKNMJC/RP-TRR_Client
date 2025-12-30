import axios, { AxiosError } from 'axios'
import type { ITicket, ITicketListResponse } from '@/types/ticket'
import type { ILoginResponse, IProfileResponse } from '@/types/auth'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired - redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  register: (data: {
    email: string
    username: string
    password: string
    fullName: string
  }) =>
    api.post<ILoginResponse>('/auth/register', data),

  login: (email: string, password: string) =>
    api.post<ILoginResponse>('/auth/login', { email, password }),

  profile: () => api.get<IProfileResponse>('/auth/profile'),

  logout: () => api.post('/auth/logout'),
}

// Ticket API
export const ticketApi = {
  getAll: (params?: {
    page?: number
    limit?: number
    status?: string
    search?: string
    priority?: string
    category?: string
  }) => api.get<ITicketListResponse>('/tickets', { params }),

  getOne: (id: string) =>
    api.get<{ success: boolean; data: ITicket }>(`/tickets/${id}`),

  create: (data: FormData) =>
    api.post<{ success: boolean; data: ITicket }>('/tickets', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: string, data: Partial<ITicket>) =>
    api.put<{ success: boolean; data: ITicket }>(`/tickets/${id}`, data),

  delete: (id: string) => api.delete(`/tickets/${id}`),

  getHistory: (ticketId: string) =>
    api.get(`/tickets/${ticketId}/history`),

  getUserTickets: (lineUserId: string) =>
    api.get<{ success: boolean; data: ITicket[] }>(`/tickets/user/${lineUserId}`),
}

export default api
