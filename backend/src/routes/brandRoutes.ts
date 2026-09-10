import { Router } from 'express';
import { getBrandSettings, updateBrandSettings } from '../controllers/brandController.js';
import { optionalAuthMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuthMiddleware, getBrandSettings);
router.put('/', optionalAuthMiddleware, updateBrandSettings);

export default router;
