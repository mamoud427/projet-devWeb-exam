import { Router } from 'express'
import { body } from 'express-validator'
import { authenticate } from '../middleware/auth.middleware'
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/project.controller'

const router = Router()

router.use(authenticate)

router.get('/', getProjects)
router.get('/:id', getProjectById)

router.post(
  '/',
  [
    body('titre')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Titre requis (min 2 caractères)'),
    body('description').optional().trim(),
  ],
  createProject
)

router.put(
  '/:id',
  [
    body('titre').optional().trim().isLength({ min: 2 }),
    body('description').optional().trim(),
  ],
  updateProject
)

router.delete('/:id', deleteProject)

export default router