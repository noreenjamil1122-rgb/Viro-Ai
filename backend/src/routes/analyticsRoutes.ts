import { Router } from 'express';
import {
  getAnalyticsMetrics,
  getAgentActivities,
  getAdminStats,
} from '../controllers/analyticsController.js';
import { optionalAuthMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/metrics', optionalAuthMiddleware, getAnalyticsMetrics);
router.get('/activities', optionalAuthMiddleware, getAgentActivities);
router.get('/admin/stats', getAdminStats);

export default router;
