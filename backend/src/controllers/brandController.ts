import { Response } from 'express';
import { BrandSettings } from '../models/BrandSettings.js';
import { AuthRequest } from '../middleware/auth.js';

function formatBrand(b: any) {
  return {
    id: b._id.toString(),
    user_id: b.userId ? b.userId.toString() : '',
    brand_name: b.brand_name || 'My Brand',
    tagline: b.tagline || '',
    category: b.category || 'E-commerce & Retail',
    target_audience: b.target_audience || 'Modern professionals and digital natives',
    logo_url: b.logo_url || '',
    primary_color: b.primary_color || '#4F46E5',
    secondary_color: b.secondary_color || '#06B6D4',
    accent_color: b.accent_color || '#F59E0B',
    font_preference: b.font_preference || 'Plus Jakarta Sans',
    tone_of_voice: b.tone_of_voice || 'Professional yet friendly',
    default_hashtags: b.default_hashtags || ['#ViroAI', '#SocialMedia', '#Growth'],
    created_at: b.createdAt ? b.createdAt.toISOString() : new Date().toISOString(),
    updated_at: b.updatedAt ? b.updatedAt.toISOString() : new Date().toISOString(),
  };
}

export async function getBrandSettings(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    let brand = await BrandSettings.findOne({ userId: req.user.id });
    if (!brand) {
      brand = await BrandSettings.create({
        userId: req.user.id,
        brand_name: 'My Brand',
      });
    }

    return res.json({ success: true, brandSettings: formatBrand(brand) });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to fetch brand settings' });
  }
}

export async function updateBrandSettings(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const updates = { ...req.body };
    delete updates._id;
    delete updates.userId;

    let brand = await BrandSettings.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updates },
      { new: true, upsert: true }
    );

    return res.json({ success: true, brandSettings: formatBrand(brand) });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to update brand settings' });
  }
}
