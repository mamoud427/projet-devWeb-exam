import api from "./api"
import type { ApiResponse, Comment } from "../types"

export const commentService = {
    
    getByTask: async (taskId: string) => {
        const res = await api.get<ApiResponse<Comment[]>>(`/tasks/${taskId}/comments`)
        return res.data
    },

    create: async (taskId: string, contenu: string) => {
        const res = await api.post<ApiResponse<Comment>>(`/tasks/${taskId}/comments`, { contenu })
        return res.data
    },

    delete: async (taskId: string, commentId: string) => {
        const res = await api.delete<ApiResponse<null>>(`/tasks/${taskId}/comments/${commentId}`)
        return res.data
    }
}