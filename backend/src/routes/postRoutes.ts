import { Router } from 'express';
import { getPosts, createPost, getPostById, updatePost, deletePost, publishPost } from '../controllers/postController.js';
import { optionalAuthMiddleware, authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuthMiddleware, getPosts);
router.post('/', optionalAuthMiddleware, createPost);
router.get('/:id', optionalAuthMiddleware, getPostById);
router.put('/:id', optionalAuthMiddleware, updatePost);
router.delete('/:id', optionalAuthMiddleware, deletePost);
router.post('/:id/publish', optionalAuthMiddleware, publishPost);

export default router;
