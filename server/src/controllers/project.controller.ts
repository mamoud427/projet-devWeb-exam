import { Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import prisma from '../config/prisma'
import { AppError } from '../middleware/error.middleware'
import { AuthRequest } from '../types'

export const getProjects = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      search = '',
      sort = 'createdAt',
      order = 'desc',
    } = req.query as Record<string, string>

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where = {
      OR: [
        { createurId: req.user!.userId },
        { membres: { some: { userId: req.user!.userId } } },
      ],
      ...(search && {
        titre: { contains: search, mode: 'insensitive' as const },
      }),
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { [sort]: order },
        include: {
          createur: { select: { id: true, nom: true, avatar: true } },
          _count: { select: { taches: true, membres: true } },
        },
      }),
      prisma.project.count({ where }),
    ])

    res.json({
      success: true,
      data: projects,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    })
  } catch (err) {
    next(err)
  }
}

export const getProjectById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.id as string,
        OR: [
          { createurId: req.user!.userId },
          { membres: { some: { userId: req.user!.userId } } },
        ],
      },
      include: {
        createur: { select: { id: true, nom: true, avatar: true } },
        membres: {
          include: {
            user: {
              select: { id: true, nom: true, email: true, avatar: true },
            },
          },
        },
        taches: {
          include: {
            assigne: { select: { id: true, nom: true, avatar: true } },
            _count: { select: { commentaires: true } },
          },
          orderBy: { ordre: 'asc' },
        },
      },
    })

    if (!project) throw new AppError('Projet introuvable.', 404)

    res.json({ success: true, data: project })
  } catch (err) {
    next(err)
  }
}

export const createProject = async (
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

    const { titre, description, membresIds = [] } = req.body

    const project = await prisma.project.create({
      data: {
        titre,
        description,
        createurId: req.user!.userId,
        membres: {
          create: [
            { userId: req.user!.userId },
            ...membresIds.map((id: string) => ({ userId: id })),
          ],
        },
      },
      include: {
        createur: { select: { id: true, nom: true, avatar: true } },
        _count: { select: { taches: true, membres: true } },
      },
    })

    res.status(201).json({ success: true, data: project })
  } catch (err) {
    next(err)
  }
}

export const updateProject = async (
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

    const project = await prisma.project.findUnique({
      where: { id: req.params.id as string },
    })
    if (!project) throw new AppError('Projet introuvable.', 404)

    if (
      project.createurId !== req.user!.userId &&
      req.user!.role !== 'ADMIN'
    ) {
      throw new AppError(
        'Seul le créateur peut modifier ce projet.',
        403
      )
    }

    const updated = await prisma.project.update({
      where: { id: req.params.id as string },
      data: {
        ...(req.body.titre && { titre: req.body.titre }),
        ...(req.body.description !== undefined && {
          description: req.body.description,
        }),
      },
      include: {
        createur: { select: { id: true, nom: true, avatar: true } },
        _count: { select: { taches: true, membres: true } },
      },
    })

    res.json({ success: true, data: updated })
  } catch (err) {
    next(err)
  }
}

export const deleteProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id as string },
    })
    if (!project) throw new AppError('Projet introuvable.', 404)

    if (
      project.createurId !== req.user!.userId &&
      req.user!.role !== 'ADMIN'
    ) {
      throw new AppError('Accès refusé.', 403)
    }

    await prisma.project.delete({ where: { id: req.params.id as string } })

    res.json({ success: true, message: 'Projet supprimé avec succès.' })
  } catch (err) {
    next(err)
  }
}