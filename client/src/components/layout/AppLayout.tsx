import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useAppDispatch } from '../../hooks/redux'
import { fetchProjects } from '../../store/slices/projectSlice'
import { NotificationBell } from '../ui/NotificationBell'

export const AppLayout = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchProjects({}))
  }, [dispatch])

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="flex items-center justify-end px-6 py-3 bg-white border-b border-gray-100">
          <NotificationBell />
        </div>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}