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

export const CATEGORY_OPTIONS = [
  { value: 'hardware', label: 'ฮาร์ดแวร์' },
  { value: 'software', label: 'ซอฟต์แวร์' },
  { value: 'network', label: 'เครือข่าย' },
  { value: 'peripheral', label: 'อุปกรณ์ต่อพ่วง' },
  { value: 'email', label: 'อีเมล' },
  { value: 'account', label: 'บัญชีผู้ใช้' },
  { value: 'other', label: 'อื่น ๆ' },
] as const

export const STATUS_OPTIONS = [
  { value: 'pending', label: 'รอดำเนินการ' },
  { value: 'in_progress', label: 'กำลังดำเนินการ' },
  { value: 'waiting_parts', label: 'รอชิ้นส่วน' },
  { value: 'completed', label: 'เสร็จสิ้น' },
  { value: 'cancelled', label: 'ยกเลิก' },
] as const

export const PRIORITY_OPTIONS = [
  { value: 'normal', label: 'ปกติ' },
  { value: 'urgent', label: 'ด่วน' },
  { value: 'critical', label: 'ด่วนมาก' },
] as const

export const ITEMS_PER_PAGE = 25
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
