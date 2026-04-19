import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface UiState {
  sidebarOpen: boolean
  modal: { type: string; data?: unknown } | null
}

const initialState: UiState = { sidebarOpen: true, modal: null }

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen },
    openModal: (state, action: PayloadAction<{ type: string; data?: unknown }>) => {
      state.modal = action.payload
    },
    closeModal: (state) => { state.modal = null },
  },
})

export const { toggleSidebar, openModal, closeModal } = uiSlice.actions
export default uiSlice.reducer