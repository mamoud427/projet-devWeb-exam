import api from './api'
import type { ApiResponse, Project } from '../types'

export const projectService = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const res = await api.get<ApiResponse<Project[]>>('/projects', { params })
    return res.data
  },
  getById: async (id: string) => {
    const res = await api.get<ApiResponse<Project>>(`/projects/${id}`)
    return res.data
  },
  create: async (data: { titre: string; description?: string }) => {
    const res = await api.post<ApiResponse<Project>>('/projects', data)
    return res.data
  },
  update: async (id: string, data: Partial<Pick<Project, 'titre' | 'description'>>) => {
    const res = await api.put<ApiResponse<Project>>(`/projects/${id}`, data)
    return res.data
  },
  delete: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/projects/${id}`)
    return res.data
  },
}