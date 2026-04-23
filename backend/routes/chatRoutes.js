import express from 'express';
import {
    getConversations,
    getMessages,
    getConversationWithUser
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/conversations', getConversations);
router.get('/messages/:conversationId', getMessages);
router.get('/with/:userId', getConversationWithUser);

export default router;
