import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => {
        localStorage.setItem('admin_token', token)
        set({ token })
      },
      logout: () => {
        localStorage.removeItem('admin_token')
        set({ token: null })
      },
    }),
    { name: 'admin-auth' }
  )
)

export default useAuthStore
