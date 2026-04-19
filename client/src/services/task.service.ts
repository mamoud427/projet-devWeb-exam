import api from './api'
import type { ApiResponse, Task, TaskStatus } from '../types'

export const taskService = {
  getByProject: async (projectId: string, params?: { statut?: TaskStatus; assigneId?: string }) => {
    const res = await api.get<ApiResponse<Task[]>>(`/projects/${projectId}/tasks`, { params })
    return res.data
  },
  create: async (projectId: string, data: Partial<Task>) => {
    const res = await api.post<ApiResponse<Task>>(`/projects/${projectId}/tasks`, data)
    return res.data
  },
  update: async (projectId: string, taskId: string, data: Partial<Task>) => {
    const res = await api.put<ApiResponse<Task>>(`/projects/${projectId}/tasks/${taskId}`, data)
    return res.data
  },
  delete: async (projectId: string, taskId: string) => {
    const res = await api.delete<ApiResponse<null>>(`/projects/${projectId}/tasks/${taskId}`)
    return res.data
  },
}