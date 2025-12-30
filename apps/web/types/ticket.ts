export type TicketStatus = 'pending' | 'in_progress' | 'waiting_parts' | 'completed' | 'cancelled'
export type TicketPriority = 'normal' | 'urgent' | 'critical'
export type TicketCategory = 'hardware' | 'software' | 'network' | 'peripheral' | 'email' | 'account' | 'other'

export interface IAttachment {
  id: string
  ticketId: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  createdAt: string
}

export interface ITicketHistory {
  id: string
  ticketId: string
  action: string
  changedBy: string
  oldValue?: string
  newValue?: string
  createdAt: string
}

export interface IUser {
  id: string
  lineUserId: string
  displayName: string
  pictureUrl?: string
  createdAt: string
  updatedAt: string
}

export interface IDepartment {
  id: string
  name: string
  code: string
  createdAt: string
  updatedAt: string
}

export interface IAdmin {
  id: string
  email: string
  fullName: string
  phone?: string
  role: 'super_admin' | 'admin' | 'viewer'
  departmentId?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

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

export interface ITicketCreateResponse {
  success: boolean
  data: ITicket
  timestamp: string
}

export interface ITicketUpdateResponse {
  success: boolean
  data: ITicket
  timestamp: string
}
