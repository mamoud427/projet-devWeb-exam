import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../../services/auth.service'
import type { User } from '../../types'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (data: { email: string; motDePasse: string }, { rejectWithValue }) => {
    try {
      const res = await authService.login(data)
      if (res.data) {
        localStorage.setItem('token', res.data.token)
        return res.data
      }
      return rejectWithValue('Erreur de connexion')
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } }
      return rejectWithValue(e.response?.data?.error || 'Erreur de connexion')
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (data: { email: string; nom: string; motDePasse: string }, { rejectWithValue }) => {
    try {
      const res = await authService.register(data)
      if (res.data) {
        localStorage.setItem('token', res.data.token)
        return res.data
      }
      return rejectWithValue("Erreur d'inscription")
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } }
      return rejectWithValue(e.response?.data?.error || "Erreur d'inscription")
    }
  }
)

export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authService.getMe()
      return res.data
    } catch {
      return rejectWithValue('Session expirée')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    },
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(register.pending, (state) => { state.loading = true; state.error = null })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload ?? null
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null
        state.token = null
        localStorage.removeItem('token')
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer