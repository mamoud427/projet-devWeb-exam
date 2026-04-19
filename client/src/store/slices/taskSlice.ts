import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { taskService } from '../../services/task.service'
import type { Task } from '@/types'

interface TaskState {
  tasks: Task[]
  loading: boolean
  error: string | null
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
}

export const fetchTasks = createAsyncThunk(
  'tasks/fetchByProject',
  async (projectId: string, { rejectWithValue }) => {
    try {
      return await taskService.getByProject(projectId)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } }
      return rejectWithValue(error.response?.data?.error || 'Erreur')
    }
  }
)

export const createTask = createAsyncThunk(
  'tasks/create',
  async ({ projectId, data }: { projectId: string; data: Partial<Task> }, { rejectWithValue }) => {
    try {
      return await taskService.create(projectId, data)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } }
      return rejectWithValue(error.response?.data?.error || 'Erreur')
    }
  }
)

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ projectId, taskId, data }: { projectId: string; taskId: string; data: Partial<Task> }, { rejectWithValue }) => {
    try {
      return await taskService.update(projectId, taskId, data)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } }
      return rejectWithValue(error.response?.data?.error || 'Erreur')
    }
  }
)

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async ({ projectId, taskId }: { projectId: string; taskId: string }, { rejectWithValue }) => {
    try {
      await taskService.delete(projectId, taskId)
      return taskId
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } }
      return rejectWithValue(error.response?.data?.error || 'Erreur')
    }
  }
)

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => { state.tasks = action.payload },
    clearTasks: (state) => { state.tasks = [] },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.loading = true })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        state.tasks = action.payload.data ?? []
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(createTask.fulfilled, (state, action) => {
        if (action.payload.data) state.tasks.push(action.payload.data)
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        if (action.payload.data) {
          const idx = state.tasks.findIndex(t => t.id === action.payload.data!.id)
          if (idx !== -1) state.tasks[idx] = action.payload.data
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload)
      })
  },
})

export const { setTasks, clearTasks } = taskSlice.actions
export default taskSlice.reducer