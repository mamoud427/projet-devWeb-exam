import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import prisma from '../config/prisma'
import { AppError } from '../middleware/error.middleware'
import { AuthRequest } from '../types'

const generateToken = (
  userId: string,
  email: string,
  role: string
): string => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
  )
}

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() })
      return
    }

    const { email, nom, motDePasse } = req.body

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) throw new AppError('Cet email est déjà utilisé.', 409)

    const hashed = await bcrypt.hash(motDePasse, 12)

    const user = await prisma.user.create({
      data: { email, nom, motDePasse: hashed },
      select: {
        id: true,
        email: true,
        nom: true,
        role: true,
        dateInscription: true,
      },
    })

    const token = generateToken(user.id, user.email, user.role)

    res.status(201).json({
      success: true,
      data: { user, token },
    })
  } catch (err) {
    next(err)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() })
      return
    }

    const { email, motDePasse } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw new AppError('Email ou mot de passe incorrect.', 401)
    }

    const isValid = await bcrypt.compare(motDePasse, user.motDePasse)
    if (!isValid) {
      throw new AppError('Email ou mot de passe incorrect.', 401)
    }

    const token = generateToken(user.id, user.email, user.role)
    const { motDePasse: _, ...userSafe } = user

    res.json({
      success: true,
      data: { user: userSafe, token },
    })
  } catch (err) {
    next(err)
  }
}

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        nom: true,
        role: true,
        avatar: true,
        dateInscription: true,
      },
    })

    if (!user) throw new AppError('Utilisateur introuvable.', 404)

    res.json({ success: true, data: user })
  } catch (err) {
    next(err)
  }
}

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { nom, avatar } = req.body

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: {
        ...(nom && { nom }),
        ...(avatar && { avatar }),
      },
      select: {
        id: true,
        email: true,
        nom: true,
        role: true,
        avatar: true,
        dateInscription: true,
      },
    })

    res.json({ success: true, data: user })
  } catch (err) {
    next(err)
  }
}

export const changePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { ancienMotDePasse, nouveauMotDePasse } = req.body

    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
    })
    if (!user) throw new AppError('Utilisateur introuvable.', 404)

    const isValid = await bcrypt.compare(ancienMotDePasse, user.motDePasse)
    if (!isValid) {
      throw new AppError('Ancien mot de passe incorrect.', 400)
    }

    const hashed = await bcrypt.hash(nouveauMotDePasse, 12)
    await prisma.user.update({
      where: { id: req.user!.userId },
      data: { motDePasse: hashed },
    })

    res.json({ success: true, message: 'Mot de passe modifié avec succès.' })
  } catch (err) {
    next(err)
  }
}