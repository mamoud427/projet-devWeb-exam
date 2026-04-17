import { Router } from 'express'
import { body } from 'express-validator'
import { authenticate } from '../middleware/auth.middleware'
import {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/task.controller'

const router = Router()

router.use(authenticate)

router.get('/:projectId/tasks', getTasksByProject)

router.post(
  '/:projectId/tasks',
  [
    body('titre')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Titre requis'),
    body('statut')
      .optional()
      .isIn(['TODO', 'IN_PROGRESS', 'DONE']),
    body('assigneId').optional().isUUID(),
  ],
  createTask
)

router.put('/:projectId/tasks/:taskId', updateTask)
router.delete('/:projectId/tasks/:taskId', deleteTask)

export default router