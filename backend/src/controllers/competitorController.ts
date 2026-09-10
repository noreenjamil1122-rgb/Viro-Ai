import { Response } from 'express';
import { Competitor } from '../models/Competitor.js';
import { AuthRequest } from '../middleware/auth.js';

function formatCompetitor(c: any) {
  return {
    id: c._id.toString(),
    user_id: c.userId ? c.userId.toString() : '',
    name: c.name,
    handle: c.handle,
    platform: c.platform,
    profile_url: c.profile_url,
    avatar_url: c.avatar_url,
    followers_count: c.followers_count || 0,
    following_count: c.following_count || 0,
    posting_frequency: c.posting_frequency || '3-4 posts/week',
    avg_engagement_rate: c.avg_engagement_rate || 3.5,
    content_categories: c.content_categories || ['Promotional', 'Educational'],
    strengths: c.strengths || [],
    weaknesses: c.weaknesses || [],
    recommendations: c.recommendations || [],
    recent_posts: c.recent_posts || [],
    is_demo: c.is_demo || false,
    created_at: c.createdAt ? c.createdAt.toISOString() : new Date().toISOString(),
  };
}

export async function getCompetitors(req: AuthRequest, res: Response) {
  try {
    const filter: any = {};
    if (req.user?.id) {
      filter.userId = req.user.id;
    }
    const competitors = await Competitor.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, competitors: competitors.map(formatCompetitor) });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to fetch competitors' });
  }
}

export async function createCompetitor(req: AuthRequest, res: Response) {
  try {
    const {
      name,
      handle,
      platform,
      profile_url,
      avatar_url,
      followers_count,
      following_count,
      posting_frequency,
      avg_engagement_rate,
      content_categories,
      strengths,
      weaknesses,
      recommendations,
      recent_posts,
    } = req.body;

    if (!name || !handle || !platform) {
      return res.status(400).json({ success: false, error: 'Name, handle, and platform are required.' });
    }

    const competitor = await Competitor.create({
      userId: req.user?.id || '000000000000000000000000',
      name,
      handle,
      platform,
      profile_url: profile_url || `https://${platform}.com/${handle.replace('@', '')}`,
      avatar_url: avatar_url || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      followers_count: followers_count || 12500,
      following_count: following_count || 450,
      posting_frequency: posting_frequency || '4 posts/week',
      avg_engagement_rate: avg_engagement_rate || 3.8,
      content_categories: content_categories || ['Product Updates', 'Behind The Scenes'],
      strengths: strengths || ['High-quality imagery', 'Consistent weekly cadence'],
      weaknesses: weaknesses || ['Infrequent video/Reels', 'Slow comment response times'],
      recommendations: recommendations || ['Publish 2 Reels per week to capture reach', 'Engage in comments within first 30 mins'],
      recent_posts: recent_posts || [],
    });

    return res.status(201).json({ success: true, competitor: formatCompetitor(competitor) });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to add competitor' });
  }
}

export async function deleteCompetitor(req: AuthRequest, res: Response) {
  try {
    const competitor = await Competitor.findByIdAndDelete(req.params.id);
    if (!competitor) {
      return res.status(404).json({ success: false, error: 'Competitor not found' });
    }
    return res.json({ success: true, message: 'Competitor removed' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to delete competitor' });
  }
}
