import { Router } from 'express'
import { body } from 'express-validator'
import { authenticate } from '../middleware/auth.middleware'
import {
  getComments,
  createComment,
  deleteComment,
} from '../controllers/comment.controller'

const router = Router()

router.use(authenticate)

router.get('/:taskId/comments', getComments)

router.post(
  '/:taskId/comments',
  [
    body('contenu')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Commentaire vide'),
  ],
  createComment
)

router.delete('/:taskId/comments/:commentId', deleteComment)

export default router