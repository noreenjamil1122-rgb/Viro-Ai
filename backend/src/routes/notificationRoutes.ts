import { Router } from 'express';
import {
  getNotifications,
  markRead,
  markAllRead,
  createNotification,
} from '../controllers/notificationController.js';
import { optionalAuthMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuthMiddleware, getNotifications);
router.post('/', optionalAuthMiddleware, createNotification);
router.put('/:id/read', optionalAuthMiddleware, markRead);
router.put('/read-all', optionalAuthMiddleware, markAllRead);

export default router;
