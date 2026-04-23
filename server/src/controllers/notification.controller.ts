import { Response, NextFunction } from 'express'
import prisma from '../config/prisma'
import { AuthRequest } from '../types'

export const getNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    const unreadCount = await prisma.notification.count({
      where: { userId: req.user!.userId, lu: false },
    })
    res.json({ success: true, data: notifications, unreadCount })
  } catch (err) {
    next(err)
  }
}

export const markAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await prisma.notification.update({
      where: { id: req.params.id as string },
      data: { lu: true },
    })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

export const markAllAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.userId, lu: false },
      data: { lu: true },
    })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

export const deleteNotification = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await prisma.notification.delete({ where: { id: req.params.id as string} })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}