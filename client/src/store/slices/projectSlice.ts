import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { projectService } from '../../services/project.service'
import type { Project } from '../../types/index'

interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  loading: boolean
  error: string | null
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  } | null
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
  pagination: null,
}

export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (params: { page?: number; search?: string } = {}, { rejectWithValue }) => {
    try {
      return await projectService.getAll(params)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } }
      return rejectWithValue(error.response?.data?.error || 'Erreur')
    }
  }
)

export const fetchProjectById = createAsyncThunk(
  'projects/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await projectService.getById(id)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } }
      return rejectWithValue(error.response?.data?.error || 'Erreur')
    }
  }
)

export const createProject = createAsyncThunk(
  'projects/create',
  async (data: { titre: string; description?: string }, { rejectWithValue }) => {
    try {
      return await projectService.create(data)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } }
      return rejectWithValue(error.response?.data?.error || 'Erreur')
    }
  }
)

export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, data }: { id: string; data: { titre?: string; description?: string } }, { rejectWithValue }) => {
    try {
      return await projectService.update(id, data)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } }
      return rejectWithValue(error.response?.data?.error || 'Erreur')
    }
  }
)

export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await projectService.delete(id)
      return id
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } }
      return rejectWithValue(error.response?.data?.error || 'Erreur')
    }
  }
)

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearCurrentProject: (state) => { state.currentProject = null },
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false
        state.projects = action.payload.data ?? []
        state.pagination = action.payload.pagination ?? null
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchProjectById.pending, (state) => { state.loading = true })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false
        state.currentProject = action.payload.data ?? null
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(createProject.fulfilled, (state, action) => {
        if (action.payload.data) state.projects.unshift(action.payload.data)
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        if (action.payload.data) {
          const idx = state.projects.findIndex(p => p.id === action.payload.data!.id)
          if (idx !== -1) state.projects[idx] = action.payload.data
          if (state.currentProject?.id === action.payload.data.id) {
            state.currentProject = action.payload.data
          }
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(p => p.id !== action.payload)
      })
  },
})

export const { clearCurrentProject, clearError } = projectSlice.actions
export default projectSlice.reducer