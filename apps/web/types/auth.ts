export interface ILoginRequest {
  email: string
  password: string
}

export interface IAdmin {
  id: string
  email: string
  username: string
  fullName: string
  role: 'super_admin' | 'admin' | 'viewer'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ILoginResponse {
  success: boolean
  data: {
    accessToken: string
    admin: IAdmin
  }
  timestamp: string
}

export interface IProfileResponse {
  success: boolean
  data: IAdmin
  timestamp: string
}
