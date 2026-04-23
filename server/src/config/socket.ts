import { Server, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import { JwtPayload } from '../types'

interface AuthSocket extends Socket {
  userId?: string
  userNom?: string
}

export let io: Server

export const initSocket = (server: Server) => {
  io = server

  // Middleware d'authentification — vérifie le JWT à la connexion
  io.use((socket: AuthSocket, next) => {
    const token = socket.handshake.auth.token
    if (!token) return next(new Error('Token manquant'))
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
      socket.userId = decoded.userId
      socket.userNom = decoded.email
      next()
    } catch {
      next(new Error('Token invalide'))
    }
  })

  io.on('connection', (socket: AuthSocket) => {
    console.log(` Connecté: ${socket.userId}`)

    // L'utilisateur rejoint sa room personnelle
    if (socket.userId) {
      socket.join(`user:${socket.userId}`)
    }

    // Rejoindre la room d'un projet
    socket.on('join:project', (projectId: string) => {
      socket.join(`project:${projectId}`)
      console.log(` ${socket.userId} a rejoint project:${projectId}`)
    })

    // Quitter la room d'un projet
    socket.on('leave:project', (projectId: string) => {
      socket.leave(`project:${projectId}`)
    })

    socket.on('disconnect', () => {
      console.log(` Déconnecté: ${socket.userId}`)
    })
  })
}

// Émettre un événement à tous les membres d'un projet
export const emitToProject = (projectId: string, event: string, data: unknown) => {
  io?.to(`project:${projectId}`).emit(event, data)
}

// Émettre un événement à un utilisateur spécifique
export const emitToUser = (userId: string, event: string, data: unknown) => {
  io?.to(`user:${userId}`).emit(event, data)
}