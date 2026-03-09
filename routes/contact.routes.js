import { Router } from 'express'
import { sendMessage, getMessages, markRead, deleteMessage } from '../controllers/contact.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/',              sendMessage)
router.get('/',  protect,     getMessages)
router.patch('/:id/read', protect, markRead)
router.delete('/:id', protect, deleteMessage)

export default router
