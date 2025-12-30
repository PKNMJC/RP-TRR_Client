import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketApi } from '@/lib/api'
import { toast } from 'sonner'
import type { ITicket } from '@/types/ticket'

export function useTickets(params?: {
  page?: number
  limit?: number
  status?: string
  search?: string
  priority?: string
  category?: string
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

export function useCreateTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: FormData) => ticketApi.create(data),
    onSuccess: (response) => {
      toast.success('สร้างแจ้งซ่อมสำเร็จ')
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error?.message || 'เกิดข้อผิดพลาดในการสร้างแจ้งซ่อม'
      )
    },
  })
}

export function useUpdateTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ITicket> }) =>
      ticketApi.update(id, data),
    onSuccess: (response) => {
      toast.success('อัปเดตแจ้งซ่อมสำเร็จ')
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      queryClient.invalidateQueries({ queryKey: ['ticket', response.data.data.id] })
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error?.message || 'เกิดข้อผิดพลาดในการอัปเดต'
      )
    },
  })
}

export function useDeleteTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => ticketApi.delete(id),
    onSuccess: () => {
      toast.success('ลบแจ้งซ่อมสำเร็จ')
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error?.message || 'เกิดข้อผิดพลาดในการลบ'
      )
    },
  })
}
