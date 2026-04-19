import api from './api'
import type { ApiResponse, AuthResponse, User } from '../types'

export const authService = {
  register: async (data: { email: string; nom: string; motDePasse: string }) => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', data)
    return res.data
  },
  login: async (data: { email: string; motDePasse: string }) => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', data)
    return res.data
  },
  getMe: async () => {
    const res = await api.get<ApiResponse<User>>('/auth/me')
    return res.data
  },
}