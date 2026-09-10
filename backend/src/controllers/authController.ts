import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { BrandSettings } from '../models/BrandSettings.js';
import { SocialAccount } from '../models/SocialAccount.js';
import { AuthRequest } from '../middleware/auth.js';
import { isDbConnected } from '../config/db.js';

function generateToken(user: any): string {
  const secret = process.env.JWT_SECRET || 'viroai_jwt_super_secret_key_2026_marketing_agents';
  return jwt.sign(
    { id: user._id.toString(), email: user.email, role: user.role },
    secret,
    { expiresIn: '30d' }
  );
}

export async function register(req: Request, res: Response) {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        error: 'MongoDB is not connected. Please add your MongoDB connection string in backend/.env',
      });
    }

    const { fullName, email, password } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ success: false, error: 'Full name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User with this email already exists.' });
    }

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password,
    });

    // Create default brand settings for the user
    await BrandSettings.create({
      userId: user._id,
      brand_name: `${fullName}'s Brand`,
      tagline: 'Scale faster with AI-driven marketing',
    });

    // Create default social platform placeholders
    const platforms = ['instagram', 'facebook', 'linkedin', 'twitter', 'tiktok', 'youtube'] as const;
    await Promise.all(
      platforms.map((platform) =>
        SocialAccount.create({
          userId: user._id,
          platform,
          account_name: '',
          account_handle: '',
          connected: false,
        }).catch(() => {})
      )
    );

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        full_name: user.fullName,
        role: user.role,
        avatar_url: user.avatarUrl,
        created_at: user.createdAt,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Registration failed' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        error: 'MongoDB is not connected. Please add your MongoDB connection string in backend/.env',
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        full_name: user.fullName,
        role: user.role,
        avatar_url: user.avatarUrl,
        created_at: user.createdAt,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Login failed' });
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    return res.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        full_name: user.fullName,
        role: user.role,
        avatar_url: user.avatarUrl,
        created_at: user.createdAt,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to fetch user' });
  }
}

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { full_name, avatar_url } = req.body;
    const updates: any = {};
    if (full_name) updates.fullName = full_name;
    if (avatar_url) updates.avatarUrl = avatar_url;

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    return res.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        full_name: user.fullName,
        role: user.role,
        avatar_url: user.avatarUrl,
        created_at: user.createdAt,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to update profile' });
  }
}
