import { Router } from 'express';
import { getSocialAccounts, toggleConnection, publishPost } from '../controllers/socialController.js';
import { optionalAuthMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/accounts', optionalAuthMiddleware, getSocialAccounts);
router.post('/connect', optionalAuthMiddleware, toggleConnection);
router.post('/publish', optionalAuthMiddleware, publishPost);

export default router;
