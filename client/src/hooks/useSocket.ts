/* eslint-disable react-hooks/refs */
import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAppDispatch, useAppSelector } from './redux'
import { updateTask, createTask, deleteTask } from '../store/slices/taskSlice'
import type { RootState } from '../store'
import type { Task } from '../types'

export const useSocket = (projectId?: string) => {
  const socketRef = useRef<Socket | null>(null)
  const dispatch = useAppDispatch()
  const token = useAppSelector((s: RootState) => s.auth.token)

  useEffect(() => {
    if (!token) return

    // Connexion au serveur Socket.io avec le token JWT
    socketRef.current = io('http://localhost:5000', {
      auth: { token },
    })

    const socket = socketRef.current

    socket.on('connect', () => {
      console.log(' Socket connecté')
      // Rejoindre la room du projet si fourni
      if (projectId) socket.emit('join:project', projectId)
    })

    // Écouter les événements temps réel
    socket.on('task:created', (task: Task) => {
      dispatch(createTask.fulfilled(
        { success: true, data: task },
        '',
        { projectId: task.projetId, data: task }
      ))
    })

    socket.on('task:updated', (task: Task) => {
      dispatch(updateTask.fulfilled(
        { success: true, data: task },
        '',
        { projectId: task.projetId, taskId: task.id, data: task }
      ))
    })

    socket.on('task:deleted', ({ id }: { id: string }) => {
      dispatch(deleteTask.fulfilled(id, '', { projectId: '', taskId: id }))
    })

    socket.on('disconnect', () => {
      console.log(' Socket déconnecté')
    })

    return () => {
      if (projectId) socket.emit('leave:project', projectId)
      socket.disconnect()
    }
  }, [token, projectId, dispatch])

  return socketRef.current
}