import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { commentService } from '../../services/comment.service'
import type { Comment } from '../../types'

interface CommentState {
  comments: Comment[]
  loading: boolean
  error: string | null
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
}

export const fetchComments = createAsyncThunk(
  'comments/fetchByTask',
  async (taskId: string, { rejectWithValue }) => {
    try { return await commentService.getByTask(taskId) }
    catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } }
      return rejectWithValue(e.response?.data?.error || 'Erreur')
    }
  }
)

export const createComment = createAsyncThunk(
  'comments/create',
  async ({ taskId, contenu }: { taskId: string; contenu: string }, { rejectWithValue }) => {
    try { return await commentService.create(taskId, contenu) }
    catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } }
      return rejectWithValue(e.response?.data?.error || 'Erreur')
    }
  }
)

export const deleteComment = createAsyncThunk(
  'comments/delete',
  async ({ taskId, commentId }: { taskId: string; commentId: string }, { rejectWithValue }) => {
    try {
      await commentService.delete(taskId, commentId)
      return commentId
    }
    catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } }
      return rejectWithValue(e.response?.data?.error || 'Erreur')
    }
  }
)

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments: (state) => { state.comments = [] },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => { state.loading = true })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false
        state.comments = action.payload.data ?? []
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(createComment.fulfilled, (state, action) => {
        if (action.payload.data) state.comments.push(action.payload.data)
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(c => c.id !== action.payload)
      })
  },
})

export const { clearComments } = commentSlice.actions
export default commentSlice.reducer