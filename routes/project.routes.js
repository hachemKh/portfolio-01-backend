import { Router } from 'express'
import {
  getProjects, getCategories, getProject,
  createProject, updateProject, deleteProject,
} from '../controllers/project.controller.js'
import { protect } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/upload.middleware.js'

const router = Router()

router.get('/',             getProjects)
router.get('/categories',   getCategories)
router.get('/:id',          getProject)
router.post('/',   protect, upload.array('images', 10), createProject)
router.put('/:id', protect, upload.array('images', 10), updateProject)
router.delete('/:id', protect, deleteProject)

export default router
