import { Response } from 'express';
import { Post } from '../models/Post.js';
import { AgentActivity } from '../models/AgentActivity.js';
import { AuthRequest } from '../middleware/auth.js';

function formatPost(p: any) {
  return {
    id: p._id.toString(),
    user_id: p.userId ? p.userId.toString() : '',
    title: p.title,
    content: p.content || '',
    caption: p.caption,
    hashtags: p.hashtags || [],
    platforms: p.platforms || ['instagram'],
    status: p.status,
    media_urls: p.media_urls || [],
    media_type: p.media_type || 'text',
    scheduled_for: p.scheduled_for ? p.scheduled_for.toISOString() : undefined,
    published_at: p.published_at ? p.published_at.toISOString() : undefined,
    error_message: p.error_message,
    ai_generated: p.ai_generated,
    agent_id: p.agent_id,
    likes_count: p.likes_count || 0,
    comments_count: p.comments_count || 0,
    shares_count: p.shares_count || 0,
    platformVariations: p.platformVariations,
    created_at: p.createdAt ? p.createdAt.toISOString() : new Date().toISOString(),
    updated_at: p.updatedAt ? p.updatedAt.toISOString() : new Date().toISOString(),
  };
}

export async function getPosts(req: AuthRequest, res: Response) {
  try {
    const filter: any = {};
    if (req.user?.id) {
      filter.userId = req.user.id;
    }
    const posts = await Post.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, posts: posts.map(formatPost) });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to fetch posts' });
  }
}

export async function createPost(req: AuthRequest, res: Response) {
  try {
    const {
      title,
      content,
      caption,
      hashtags,
      platforms,
      status,
      media_urls,
      media_type,
      scheduled_for,
      ai_generated,
      agent_id,
      platformVariations,
    } = req.body;

    if (!title || !caption) {
      return res.status(400).json({ success: false, error: 'Title and caption are required.' });
    }

    const newPost = await Post.create({
      userId: req.user?.id || '000000000000000000000000',
      title,
      content: content || '',
      caption,
      hashtags: hashtags || [],
      platforms: platforms || ['instagram'],
      status: status || 'draft',
      media_urls: media_urls || [],
      media_type: media_type || 'text',
      scheduled_for: scheduled_for ? new Date(scheduled_for) : undefined,
      ai_generated: Boolean(ai_generated),
      agent_id: agent_id || '',
      platformVariations,
    });

    if (req.user?.id) {
      await AgentActivity.create({
        userId: req.user.id,
        agent_name: 'Content Studio Agent',
        agent_type: 'content_studio',
        action: `Created new post: "${title}"`,
        status: 'success',
        details: `Saved as ${newPost.status}`,
      }).catch(() => {});
    }

    return res.status(201).json({ success: true, post: formatPost(newPost) });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to create post' });
  }
}

export async function getPostById(req: AuthRequest, res: Response) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    return res.json({ success: true, post: formatPost(post) });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to get post' });
  }
}

export async function updatePost(req: AuthRequest, res: Response) {
  try {
    const updates = { ...req.body };
    if (updates.scheduled_for) updates.scheduled_for = new Date(updates.scheduled_for);
    if (updates.published_at) updates.published_at = new Date(updates.published_at);

    const post = await Post.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    return res.json({ success: true, post: formatPost(post) });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to update post' });
  }
}

export async function deletePost(req: AuthRequest, res: Response) {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    return res.json({ success: true, message: 'Post deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to delete post' });
  }
}

export async function publishPost(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    post.status = 'published';
    post.published_at = new Date();
    await post.save();

    if (req.user?.id) {
      await AgentActivity.create({
        userId: req.user.id,
        agent_name: 'Publishing Agent',
        agent_type: 'publishing',
        action: `Dispatched post: "${post.title}"`,
        status: 'success',
        details: `Published to ${post.platforms.join(', ')}`,
      }).catch(() => {});
    }

    return res.json({
      success: true,
      message: `Successfully published to ${post.platforms.join(', ').toUpperCase()}!`,
      post: formatPost(post),
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to publish post' });
  }
}
