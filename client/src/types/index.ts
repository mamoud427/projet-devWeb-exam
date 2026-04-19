export type Role = 'ADMIN' | 'MEMBER'
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export interface User {
  id: string
  email: string
  nom: string
  role: Role
  avatar?: string | null
  dateInscription: string
}

export interface Project {
  id: string
  titre: string
  description?: string
  createdAt: string
  updatedAt: string
  createurId: string
  createur: Pick<User, 'id' | 'nom' | 'avatar'>
  _count?: { taches: number; membres: number }
}

export interface Task {
  id: string
  titre: string
  description?: string
  statut: TaskStatus
  echeance?: string
  ordre: number
  projetId: string
  assigneId?: string
  assigne?: Pick<User, 'id' | 'nom' | 'avatar'>
  _count?: { commentaires: number }
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  contenu: string
  auteurId: string
  auteur: Pick<User, 'id' | 'nom' | 'avatar'>
  tacheId: string
  createdAt: string
}

export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
  pagination?: Pagination
}

export interface AuthResponse {
  user: User
  token: string
}