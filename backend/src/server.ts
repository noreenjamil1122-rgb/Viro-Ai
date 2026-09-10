import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import competitorRoutes from './routes/competitorRoutes.js';
import socialRoutes from './routes/socialRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const isMongoConnected = mongoose.connection.readyState === 1;
  res.json({
    status: 'ok',
    appName: 'ViroAI Standalone API',
    version: '2.0.0',
    port: PORT,
    database: {
      engine: 'MongoDB',
      connected: isMongoConnected,
      status: isMongoConnected ? 'connected' : 'disconnected (set MONGO_URI in backend/.env)',
    },
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    hasGeminiImageKey: Boolean(process.env.GEMINI_IMAGE_API_KEY),
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Register modular API routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api/competitors', competitorRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);

// Admin stats endpoint alias for backward compatibility
app.get('/api/admin/stats', async (req, res, next) => {
  try {
    const { getAdminStats } = await import('./controllers/analyticsController.js');
    return getAdminStats(req, res);
  } catch (err) {
    next(err);
  }
});

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 [ViroAI Backend] Running on http://localhost:${PORT}`);
  console.log(`📡 [ViroAI Backend] Health check: http://localhost:${PORT}/api/health`);
});
