import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useAppDispatch } from '../../hooks/redux'
import { fetchProjects } from '../../store/slices/projectSlice'

export const AppLayout = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchProjects({}))
  }, [dispatch])

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}