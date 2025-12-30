import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useWebSocket() {
  const socketRef = useRef<Socket | null>(null)
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
      toast.info(`แจ้งซ่อมใหม่: ${ticket.ticketNumber}`)
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    })

    socket.on('ticket:updated', (ticket) => {
      toast.info(`อัปเดตแจ้งซ่อม: ${ticket.ticketNumber}`)
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
