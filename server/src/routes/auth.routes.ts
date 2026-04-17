import { Router } from 'express'
import { body } from 'express-validator'
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.post(
  '/register',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Email invalide'),
    body('nom')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Nom trop court (min 2 caractères)'),
    body('motDePasse')
      .isLength({ min: 8 })
      .withMessage('Mot de passe trop court (min 8 caractères)'),
  ],
  register
)

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('motDePasse').notEmpty().withMessage('Mot de passe requis'),
  ],
  login
)

router.get('/me', authenticate, getMe)
router.put('/profile', authenticate, updateProfile)
router.put('/password', authenticate, changePassword)

export default router