import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const profileQuery = useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: async () => {
      const response = await authApi.profile()
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  })

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (response) => {
      const { accessToken, admin } = response.data.data

      localStorage.setItem('access_token', accessToken)
      queryClient.setQueryData(['auth', 'profile'], admin)

      toast.success('เข้าสู่ระบบสำเร็จ')
      router.push('/dashboard')
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error?.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
      )
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      localStorage.removeItem('access_token')
      queryClient.clear()
      toast.success('ออกจากระบบสำเร็จ')
      router.push('/login')
    },
    onError: (error: any) => {
      toast.error('เกิดข้อผิดพลาดในการออกจากระบบ')
    },
  })

  return {
    admin: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    login: loginMutation.mutate,
    loginLoading: loginMutation.isPending,
    logout: logoutMutation.mutate,
    logoutLoading: logoutMutation.isPending,
    isAuthenticated: !!profileQuery.data,
  }
}
