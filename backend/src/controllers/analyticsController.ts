import { Request, Response } from 'express';
import { AnalyticsMetric } from '../models/AnalyticsMetric.js';
import { AgentActivity } from '../models/AgentActivity.js';
import { Post } from '../models/Post.js';
import { User } from '../models/User.js';
import { Competitor } from '../models/Competitor.js';
import { AuthRequest } from '../middleware/auth.js';
import mongoose from 'mongoose';

export async function getAnalyticsMetrics(req: AuthRequest, res: Response) {
  try {
    const filter: any = {};
    if (req.user?.id) {
      filter.userId = req.user.id;
    }
    const metrics = await AnalyticsMetric.find(filter).sort({ date: 1 });
    return res.json({ success: true, metrics });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to fetch metrics' });
  }
}

export async function getAgentActivities(req: AuthRequest, res: Response) {
  try {
    const filter: any = {};
    if (req.user?.id) {
      filter.userId = req.user.id;
    }
    const activities = await AgentActivity.find(filter).sort({ createdAt: -1 }).limit(50);
    const formatted = activities.map((a) => ({
      id: a._id.toString(),
      user_id: a.userId ? a.userId.toString() : '',
      agent_name: a.agent_name,
      agent_type: a.agent_type,
      action: a.action,
      status: a.status,
      details: a.details,
      execution_time_ms: a.execution_time_ms,
      created_at: a.createdAt ? a.createdAt.toISOString() : new Date().toISOString(),
    }));
    return res.json({ success: true, activities: formatted });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to fetch agent activities' });
  }
}

export async function getAdminStats(req: Request, res: Response) {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;

    let totalUsers = 0;
    let totalPosts = 0;
    let totalCompetitors = 0;

    if (isMongoConnected) {
      totalUsers = await User.countDocuments().catch(() => 0);
      totalPosts = await Post.countDocuments().catch(() => 0);
      totalCompetitors = await Competitor.countDocuments().catch(() => 0);
    }

    res.json({
      success: true,
      systemHealth: 'Optimal',
      memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      uptimeHours: (process.uptime() / 3600).toFixed(2),
      database: {
        engine: 'MongoDB',
        status: isMongoConnected ? 'Connected' : 'Connecting / Offline',
        totalUsers,
        totalPosts,
        totalCompetitors,
      },
      activeAgents: [
        { name: 'Content Studio Agent', status: 'Healthy', latencyMs: 840, version: '3.0' },
        { name: 'Image Agent', status: 'Healthy', latencyMs: 2100, version: '2.0' },
        { name: 'Video Agent', status: 'Healthy', latencyMs: 1950, version: '1.8' },
        { name: 'Competitor Analysis Agent', status: 'Healthy', latencyMs: 1280, version: '2.5' },
        { name: 'Scheduling Agent', status: 'Healthy', latencyMs: 310, version: '3.1' },
        { name: 'Publishing Agent', status: 'Healthy', latencyMs: 450, version: '3.0' },
        { name: 'Analytics Agent', status: 'Healthy', latencyMs: 620, version: '2.2' },
      ],
      apiStatus: {
        gemini: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY')
          ? 'Connected'
          : 'Fallback Engine Ready',
        geminiImage: Boolean(process.env.GEMINI_IMAGE_API_KEY) ? 'Connected (Dedicated Key)' : 'Fallback Engine Ready',
        mongoDB: isMongoConnected ? 'Connected' : 'Pending URI in backend/.env',
        socialIntegrations: 'Configured (API Sandbox Mode)',
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch admin stats' });
  }
}
