import { Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import prisma from '../config/prisma'
import { AppError } from '../middleware/error.middleware'
import { AuthRequest } from '../types'

export const getComments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const comments = await prisma.comment.findMany({
      where: { tacheId: req.params.taskId as string },
      include: {
        auteur: { select: { id: true, nom: true, avatar: true } },
      },
      orderBy: { createdAt: 'asc' },
    })

    res.json({ success: true, data: comments })
  } catch (err) {
    next(err)
  }
}

export const createComment = async (
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

    const comment = await prisma.comment.create({
      data: {
        contenu: req.body.contenu,
        auteurId: req.user!.userId,
        tacheId: req.params.taskId as string,
      },
      include: {
        auteur: { select: { id: true, nom: true, avatar: true } },
      },
    })

    res.status(201).json({ success: true, data: comment })
  } catch (err) {
    next(err)
  }
}

export const deleteComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: req.params.commentId as string},
    })
    if (!comment) throw new AppError('Commentaire introuvable.', 404)

    if (
      comment.auteurId !== req.user!.userId &&
      req.user!.role !== 'ADMIN'
    ) {
      throw new AppError('Accès refusé.', 403)
    }

    await prisma.comment.delete({ where: { id: req.params.commentId as string} })

    res.json({ success: true, message: 'Commentaire supprimé.' })
  } catch (err) {
    next(err)
  }
}