import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware.js';
import { getAllChats, getAllContacts, getMessagesByUserId, sendMessage } from '../controllers/message.controller.js';
import { arcjetProtection } from '../middlewares/arcjet.middleware.js';

const router = express.Router();

router.use(arcjetProtection,protectRoute)

router.get('/contacts',getAllContacts)
router.get('/chats',getAllChats)
router.get('/:id',getMessagesByUserId)
router.get('/send/:id',sendMessage)

export default router;