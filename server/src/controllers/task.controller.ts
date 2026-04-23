import { Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { TaskStatus } from '@prisma/client'
import prisma from '../config/prisma'
import { AppError } from '../middleware/error.middleware'
import { AuthRequest } from '../types'
import { emitToProject } from '../config/socket'

export const getTasksByProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { statut, assigneId } = req.query as Record<string, string>

    const tasks = await prisma.task.findMany({
      where: {
        projetId: req.params.projectId as string,
        ...(statut && { statut: statut as TaskStatus }),
        ...(assigneId && { assigneId }),
      },
      include: {
        assigne: { select: { id: true, nom: true, avatar: true } },
        _count: { select: { commentaires: true, fichiers: true } },
      },
      orderBy: { ordre: 'asc' },
    })

    res.json({ success: true, data: tasks })
  } catch (err) {
    next(err)
  }
}

export const createTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() })
      return
    }

    const { titre, description, assigneId, echeance, statut } = req.body

    const task = await prisma.task.create({
      data: {
        titre,
        description,
        assigneId: assigneId || null,
        echeance: echeance ? new Date(echeance) : null,
        statut: statut || TaskStatus.TODO,
        projetId: req.params.projectId as string,
      },
      include: {
        assigne: { select: { id: true, nom: true, avatar: true } },
      },
    })


  // Emettre l'evenement en temps reel a tous les membres du projet 
  emitToProject(req.params.projectId as string, 'task:created', task)

    res.status(201).json({ success: true, data: task })
  } catch (err) {
    next(err)
  }
}

export const updateTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.taskId as string},
    })
    if (!task) throw new AppError('Tâche introuvable.', 404)

    const { titre, description, assigneId, echeance, statut, ordre } =
      req.body

    const updated = await prisma.task.update({
      where: { id: req.params.taskId as string},
      data: {
        ...(titre && { titre }),
        ...(description !== undefined && { description }),
        ...(assigneId !== undefined && { assigneId }),
        ...(echeance !== undefined && {
          echeance: echeance ? new Date(echeance) : null,
        }),
        ...(statut && { statut }),
        ...(ordre !== undefined && { ordre }),
      },
      include: {
        assigne: { select: { id: true, nom: true, avatar: true } },
      },
    })

  // Emettre l'evenement en temps reel a tous les membres du projet 
  emitToProject(req.params.projectId as string, 'task:updated', updated)

    res.json({ success: true, data: updated })
  } catch (err) {
    next(err)
  }
}

export const deleteTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.taskId as string },
    })
    if (!task) throw new AppError('Tâche introuvable.', 404)

    await prisma.task.delete({ where: { id: req.params.taskId as string } })


  // Emettre l'evenement en temps reel
    emitToProject(task.projetId, 'task:deleted', { id: req.params.taskId })

    res.json({ success: true, message: 'Tâche supprimée.' })
  } catch (err) {
    next(err)
  }
}