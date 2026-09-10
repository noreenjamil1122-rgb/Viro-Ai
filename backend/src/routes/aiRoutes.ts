import { Router } from 'express';
import {
  generateStudioPost,
  generateContent,
  quickGenerator,
  generateImage,
  generateVideo,
  analyzeCompetitor,
  generateAnalyticsInsights,
} from '../controllers/aiController.js';

const router = Router();

router.post('/studio-post-agent', generateStudioPost);
router.post('/content-agent', generateContent);
router.post('/quick-generator', quickGenerator);
router.post('/image-agent', generateImage);
router.post('/video-agent', generateVideo);
router.post('/competitor-agent', analyzeCompetitor);
router.post('/analytics-agent', generateAnalyticsInsights);

export default router;
