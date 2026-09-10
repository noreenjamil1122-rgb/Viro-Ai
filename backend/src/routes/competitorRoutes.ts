import { Router } from 'express';
import { getCompetitors, createCompetitor, deleteCompetitor } from '../controllers/competitorController.js';
import { optionalAuthMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuthMiddleware, getCompetitors);
router.post('/', optionalAuthMiddleware, createCompetitor);
router.delete('/:id', optionalAuthMiddleware, deleteCompetitor);

export default router;
