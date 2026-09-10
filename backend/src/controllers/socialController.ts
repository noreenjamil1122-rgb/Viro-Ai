import { Response } from 'express';
import { SocialAccount } from '../models/SocialAccount.js';
import { AuthRequest } from '../middleware/auth.js';

function formatSocial(s: any) {
  return {
    id: s._id.toString(),
    user_id: s.userId ? s.userId.toString() : '',
    platform: s.platform,
    account_name: s.account_name || '',
    account_handle: s.account_handle || '',
    profile_picture: s.profile_picture || '',
    connected: Boolean(s.connected),
    connected_at: s.connected_at ? s.connected_at.toISOString() : undefined,
    followers_count: s.followers_count || 0,
  };
}

export async function getSocialAccounts(req: AuthRequest, res: Response) {
  try {
    const filter: any = {};
    if (req.user?.id) {
      filter.userId = req.user.id;
    }
    const accounts = await SocialAccount.find(filter);
    return res.json({ success: true, accounts: accounts.map(formatSocial) });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to fetch social accounts' });
  }
}

export async function toggleConnection(req: AuthRequest, res: Response) {
  try {
    const { platform, connect, account_name, account_handle } = req.body;
    if (!platform) {
      return res.status(400).json({ success: false, error: 'Platform is required' });
    }

    const userId = req.user?.id || '000000000000000000000000';
    let account = await SocialAccount.findOne({ userId, platform });

    if (!account) {
      account = new SocialAccount({
        userId,
        platform,
      });
    }

    account.connected = Boolean(connect);
    if (connect) {
      account.connected_at = new Date();
      if (account_name) account.account_name = account_name;
      if (account_handle) account.account_handle = account_handle;
      if (!account.followers_count) account.followers_count = Math.floor(Math.random() * 5000) + 1200;
    }

    await account.save();
    return res.json({ success: true, account: formatSocial(account) });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to toggle account' });
  }
}

export async function publishPost(req: AuthRequest, res: Response) {
  try {
    const { postId, platforms, title, caption, mediaUrls } = req.body;

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return res.status(400).json({ success: false, error: 'Please select at least one social media platform.' });
    }

    // Platform validation checks
    const platformErrors: string[] = [];
    if (platforms.includes('twitter') && caption && caption.length > 280) {
      platformErrors.push('X (Twitter) posts must be under 280 characters.');
    }
    if (platforms.includes('instagram') && (!mediaUrls || mediaUrls.length === 0)) {
      platformErrors.push('Instagram posts require at least one photo or video asset.');
    }

    if (platformErrors.length > 0) {
      return res.status(400).json({ success: false, error: platformErrors.join(' ') });
    }

    // Simulate network dispatch delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    return res.json({
      success: true,
      publishedAt: new Date().toISOString(),
      dispatchedPlatforms: platforms,
      status: 'published',
      message: `Successfully published to ${platforms.join(', ').toUpperCase()}!`,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Publishing dispatch failed' });
  }
}
