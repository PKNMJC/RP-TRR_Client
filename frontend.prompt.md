# Frontend Development Prompt - Next.js Admin & LIFF

## 🎯 Your Role
You are a senior Frontend developer building a professional admin dashboard and LINE LIFF app. Create production-ready, responsive, and accessible interfaces using modern React patterns.

---

## 🏗️ Project Structure

```
apps/web/                       # Admin Panel (Next.js App Router)
├── src/
│   ├── app/
│   │   ├── (auth)/            # Auth routes group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/       # Dashboard routes group
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── tickets/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── departments/
│   │   │   │   └── page.tsx
│   │   │   ├── admins/
│   │   │   │   └── page.tsx
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx     # Dashboard layout with sidebar
│   │   │
│   │   ├── api/               # API routes (if needed)
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts
│   │   │
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/            # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MainLayout.tsx
│   │   │
│   │   ├── tickets/           # Ticket components
│   │   │   ├── TicketCard.tsx
│   │   │   ├── TicketList.tsx
│   │   │   ├── TicketDetail.tsx
│   │   │   ├── TicketFilters.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── PriorityBadge.tsx
│   │   │   └── TicketTimeline.tsx
│   │   │
│   │   ├── dashboard/         # Dashboard components
│   │   │   ├── StatsCard.tsx
│   │   │   ├── TicketChart.tsx
│   │   │   ├── CategoryChart.tsx
│   │   │   └── RecentTickets.tsx
│   │   │
│   │   └── shared/            # Shared components
│   │       ├── Loading.tsx
│   │       ├── ErrorState.tsx
│   │       ├── EmptyState.tsx
│   │       ├── Pagination.tsx
│   │       ├── SearchBar.tsx
│   │       └── FileUpload.tsx
│   │
│   ├── lib/
│   │   ├── api.ts             # API client (axios)
│   │   ├── utils.ts           # Utility functions
│   │   ├── validators.ts      # Form validation
│   │   └── constants.ts       # Constants
│   │
│   ├── hooks/
│   │   ├── useTickets.ts      # Ticket data fetching
│   │   ├── useAuth.ts         # Authentication
│   │   ├── useWebSocket.ts    # WebSocket connection
│   │   ├── useDebounce.ts     # Debounce hook
│   │   └── useLocalStorage.ts
│   │
│   ├── types/
│   │   ├── ticket.ts
│   │   ├── user.ts
│   │   ├── admin.ts
│   │   └── api.ts
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── WebSocketContext.tsx
│   │
│   └── styles/
│       └── globals.css
│
├── public/
│   ├── images/
│   └── icons/
│
├── .env.local
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json

apps/liff/                      # LINE LIFF App
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Landing (redirect to /ticket/new)
│   │   ├── ticket/
│   │   │   ├── new/
│   │   │   │   └── page.tsx   # Create ticket form
│   │   │   └── status/
│   │   │       └── page.tsx   # View user tickets
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                # Shared shadcn components
│   │   ├── forms/
│   │   │   ├── TicketForm.tsx
│   │   │   ├── FormField.tsx
│   │   │   └── ImageUpload.tsx
│   │   └── status/
│   │       ├── TicketStatusList.tsx
│   │       └── TicketStatusCard.tsx
│   │
│   ├── lib/
│   │   ├── liff.ts            # LIFF SDK wrapper
│   │   ├── api.ts
│   │   └── utils.ts
│   │
│   ├── hooks/
│   │   ├── useLiff.ts         # LIFF initialization
│   │   └── useTicketForm.ts
│   │
│   └── types/
│       └── index.ts
│
├── public/
├── .env.local
├── next.config.js
└── package.json
```

---

## 📋 Implementation Checklist

### Phase 1: Admin Panel Setup
- [ ] Initialize Next.js 14 with App Router
- [ ] Install and configure Tailwind CSS
- [ ] Setup shadcn/ui components
- [ ] Create folder structure
- [ ] Setup TypeScript strict mode
- [ ] Configure environment variables

### Phase 2: Authentication
- [ ] Create login page
- [ ] Implement JWT token storage
- [ ] Create auth context/provider
- [ ] Implement protected routes
- [ ] Add logout functionality
- [ ] Handle token refresh

### Phase 3: Layout & Navigation
- [ ] Create dashboard layout with sidebar
- [ ] Implement responsive navigation
- [ ] Add breadcrumbs
- [ ] Create mobile menu
- [ ] Add user profile dropdown
- [ ] Implement theme switcher (optional)

### Phase 4: Dashboard
- [ ] Create stats cards with real-time data
- [ ] Implement charts (recharts)
- [ ] Add recent tickets list
- [ ] Create quick actions
- [ ] Add date range selector

### Phase 5: Ticket Management
- [ ] Create ticket list page with filters
- [ ] Implement search functionality
- [ ] Add pagination
- [ ] Create ticket detail page
- [ ] Implement status update form
- [ ] Add assignment dropdown
- [ ] Create comment/history timeline
- [ ] Add file preview modal

### Phase 6: Real-time Updates
- [ ] Setup Socket.IO client
- [ ] Connect to WebSocket server
- [ ] Handle ticket updates
- [ ] Show toast notifications
- [ ] Update UI in real-time

### Phase 7: LIFF App
- [ ] Initialize LIFF SDK
- [ ] Create ticket submission form
- [ ] Implement image upload
- [ ] Create ticket status page
- [ ] Handle LIFF authentication
- [ ] Test on LINE app

### Phase 8: Polish & Optimization
- [ ] Add loading states
- [ ] Create error boundaries
- [ ] Implement skeleton loaders
- [ ] Add empty states
- [ ] Optimize images (next/image)
- [ ] Add meta tags for SEO
- [ ] Test responsive design

---

## 🎨 Design System

### Colors (Tailwind)
```css
/* globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }
}
```

### Status Colors
```typescript
// lib/constants.ts
export const STATUS_COLORS = {
  pending: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  waiting_parts: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
} as const

export const PRIORITY_COLORS = {
  normal: 'bg-gray-100 text-gray-800',
  urgent: 'bg-yellow-100 text-yellow-800',
  critical: 'bg-red-100 text-red-800',
} as const
```

---

## 🎯 Critical Implementation Rules

### 1. TypeScript Types

```typescript
// types/ticket.ts
export type TicketStatus = 'pending' | 'in_progress' | 'waiting_parts' | 'completed' | 'cancelled'
export type TicketPriority = 'normal' | 'urgent' | 'critical'
export type TicketCategory = 'hardware' | 'software' | 'network' | 'peripheral' | 'email' | 'account' | 'other'

export interface ITicket {
  id: string
  ticketNumber: string
  userId: string
  nickname: string
  departmentId: string
  phone?: string
  locationBuilding: string
  locationFloor: string
  locationRoom: string
  locationDetail?: string
  category: TicketCategory
  issueTitle: string
  issueDescription?: string
  priority: TicketPriority
  status: TicketStatus
  assignedTo?: string
  assignedAt?: string
  completedAt?: string
  cancelledAt?: string
  createdAt: string
  updatedAt: string
  
  // Relations
  user?: IUser
  department?: IDepartment
  assignedToAdmin?: IAdmin
  attachments?: IAttachment[]
  history?: ITicketHistory[]
}

export interface ITicketListResponse {
  success: boolean
  data: ITicket[]
  meta: {
    total: number
    page: number
    limit: number
    hasMore: boolean
  }
  timestamp: string
}
```

### 2. API Client Setup

```typescript
// lib/api.ts
import axios, { AxiosError } from 'axios'
import type { ITicket, ITicketListResponse } from '@/types/ticket'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
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
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API methods
export const ticketApi = {
  getAll: (params?: {
    page?: number
    limit?: number
    status?: string
    search?: string
  }) => api.get<ITicketListResponse>('/api/v1/tickets', { params }),
  
  getOne: (id: string) => api.get<{ success: boolean; data: ITicket }>(`/api/v1/tickets/${id}`),
  
  create: (data: FormData) => api.post<{ success: boolean; data: ITicket }>('/api/v1/tickets', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  
  update: (id: string, data: Partial<ITicket>) => 
    api.put<{ success: boolean; data: ITicket }>(`/api/v1/tickets/${id}`, data),
  
  getUserTickets: (lineUserId: string) =>
    api.get<{ success: boolean; data: ITicket[] }>(`/api/v1/tickets/user/${lineUserId}`),
}

export default api
```

### 3. Custom Hooks

```typescript
// hooks/useTickets.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketApi } from '@/lib/api'
import { toast } from 'sonner'

export function useTickets(params?: {
  page?: number
  limit?: number
  status?: string
  search?: string
}) {
  return useQuery({
    queryKey: ['tickets', params],
    queryFn: async () => {
      const response = await ticketApi.getAll(params)
      return response.data
    },
    staleTime: 30000, // 30 seconds
  })
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      const response = await ticketApi.getOne(id)
      return response.data.data
    },
    enabled: !!id,
  })
}

export function useUpdateTicket() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ITicket> }) =>
      ticketApi.update(id, data),
    onSuccess: (response) => {
      toast.success('Ticket updated successfully')
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      queryClient.invalidateQueries({ queryKey: ['ticket', response.data.data.id] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to update ticket')
    },
  })
}
```

```typescript
// hooks/useWebSocket.ts
import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useWebSocket() {
  const socketRef = useRef<Socket>()
  const queryClient = useQueryClient()

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001', {
      transports: ['websocket'],
      autoConnect: true,
    })

    socket.on('connect', () => {
      console.log('WebSocket connected')
    })

    socket.on('ticket:created', (ticket) => {
      toast.info(`New ticket: ${ticket.ticketNumber}`)
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    })

    socket.on('ticket:updated', (ticket) => {
      toast.info(`Ticket ${ticket.ticketNumber} updated`)
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      queryClient.invalidateQueries({ queryKey: ['ticket', ticket.id] })
    })

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
    })

    socketRef.current = socket

    return () => {
      socket.disconnect()
    }
  }, [queryClient])

  return socketRef.current
}
```

```typescript
// hooks/useLiff.ts (for LIFF app)
import { useEffect, useState } from 'react'
import liff from '@line/liff'

export function useLiff() {
  const [isReady, setIsReady] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    liff
      .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
      .then(() => {
        if (!liff.isLoggedIn()) {
          liff.login()
          return
        }
        
        return liff.getProfile()
      })
      .then((profile) => {
        setProfile(profile)
        setIsReady(true)
      })
      .catch((err) => {
        console.error('LIFF init failed', err)
        setError(err)
      })
  }, [])

  return { isReady, profile, error, liff }
}
```

### 4. Component Examples

```typescript
// components/tickets/TicketCard.tsx
'use client'

import { ITicket } from '@/types/ticket'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from './StatusBadge'
import { PriorityBadge } from './PriorityBadge'
import { formatDistanceToNow } from 'date-fns'
import { th } from 'date-fns/locale'

interface TicketCardProps {
  ticket: ITicket
  onClick?: () => void
}

export function TicketCard({ ticket, onClick }: TicketCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">
              {ticket.ticketNumber}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {ticket.issueTitle}
            </p>
          </div>
          <div className="flex gap-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">ผู้แจ้ง</p>
            <p className="font-medium">{ticket.nickname}</p>
          </div>
          <div>
            <p className="text-muted-foreground">แผนก</p>
            <p className="font-medium">{ticket.department?.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">สถานที่</p>
            <p className="font-medium">
              {ticket.locationBuilding} {ticket.locationFloor}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">แจ้งเมื่อ</p>
            <p className="font-medium">
              {formatDistanceToNow(new Date(ticket.createdAt), {
                addSuffix: true,
                locale: th,
              })}
            </p>
          </div>
        </div>
        
        {ticket.assignedToAdmin && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground">ผู้รับผิดชอบ</p>
            <p className="text-sm font-medium">{ticket.assignedToAdmin.fullName}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

```typescript
// components/tickets/TicketFilters.tsx
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

interface TicketFiltersProps {
  onFilterChange: (filters: any) => void
}

export function TicketFilters({ onFilterChange }: TicketFiltersProps) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [priority, setPriority] = useState<string>('all')
  
  const debouncedSearch = useDebounce(search, 300)

  // Update filters when values change
  useEffect(() => {
    onFilterChange({
      search: debouncedSearch || undefined,
      status: status !== 'all' ? status : undefined,
      priority: priority !== 'all' ? priority : undefined,
    })
  }, [debouncedSearch, status, priority, onFilterChange])

  const handleReset = () => {
    setSearch('')
    setStatus('all')
    setPriority('all')
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="ค้นหาเลขที่, ชื่อผู้แจ้ง, ปัญหา..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Status Filter */}
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="สถานะ" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">ทั้งหมด</SelectItem>
          <SelectItem value="pending">รอดำเนินการ</SelectItem>
          <SelectItem value="in_progress">กำลังดำเนินการ</SelectItem>
          <SelectItem value="waiting_parts">รอชิ้นส่วน</SelectItem>
          <SelectItem value="completed">เสร็จสิ้น</SelectItem>
          <SelectItem value="cancelled">ยกเลิก</SelectItem>
        </SelectContent>
      </Select>

      {/* Priority Filter */}
      <Select value={priority} onValueChange={setPriority}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="ความเร่งด่วน" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">ทั้งหมด</SelectItem>
          <SelectItem value="normal">ปกติ</SelectItem>
          <SelectItem value="urgent">ด่วน</SelectItem>
          <SelectItem value="critical">ด่วนมาก</SelectItem>
        </SelectContent>
      </Select>

      {/* Reset Button */}
      <Button variant="outline" onClick={handleReset} className="w-full md:w-auto">
        <X className="h-4 w-4 mr-2" />
        ล้างตัวกรอง
      </Button>
    </div>
  )
}
```

```typescript
// app/(dashboard)/tickets/page.tsx
'use client'

import { useState } from 'react'
import { useTickets } from '@/hooks/useTickets'
import { useRouter } from 'next/navigation'
import { TicketCard } from '@/components/tickets/TicketCard'
import { TicketFilters } from '@/components/tickets/TicketFilters'
import { Pagination } from '@/components/shared/Pagination'
import { LoadingState } from '@/components/shared/LoadingState'
import { ErrorState } from '@/components/shared/ErrorState'
import { EmptyState } from '@/components/shared/EmptyState'

export default function TicketsPage() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({})

  const { data, isLoading, error } = useTickets({
    page,
    limit: 25,
    ...filters,
  })

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error} />
  if (!data?.data.length) return <EmptyState message="ไม่พบรายการแจ้งซ่อม" />

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">รายการแจ้งซ่อม</h1>
        <p className="text-muted-foreground">
          จัดการและติดตามรายการแจ้งซ่อมทั้งหมด
        </p>
      </div>

      <TicketFilters onFilterChange={setFilters} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.data.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onClick={() => router.push(`/tickets/${ticket.id}`)}
          />
        ))}
      </div>

      {data.meta && (
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(data.meta.total / data.meta.limit)}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  )
}
```

---

## 🔐 Authentication Flow

```typescript
// contexts/AuthContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

interface IAdmin {
  id: string
  email: string
  fullName: string
  role: 'super_admin' | 'admin' | 'viewer'
}

interface AuthContextType {
  admin: IAdmin | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<IAdmin | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token')
    if (token) {
      // Validate token and get user info
      fetchProfile()
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/v1/auth/profile')
      setAdmin(response.data.data)
    } catch (error) {
      localStorage.removeItem('access_token')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await api.post('/api/v1/auth/login', { email, password })
    const { accessToken, admin } = response.data.data
    
    localStorage.setItem('access_token', accessToken)
    setAdmin(admin)
    router.push('/dashboard')
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    setAdmin(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ admin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

---

## 📱 LIFF App Example

```typescript
// apps/liff/src/app/ticket/new/page.tsx
'use client'

import { useState } from 'react'
import { useLiff } from '@/hooks/useLiff'
import { ticketApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function NewTicketPage() {
  const { isReady, profile, liff } = useLiff()
  const [isSubmitting, set