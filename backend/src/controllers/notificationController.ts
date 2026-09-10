import { Response } from 'express';
import { Notification } from '../models/Notification.js';
import { AuthRequest } from '../middleware/auth.js';

function formatNotification(n: any) {
  return {
    id: n._id.toString(),
    user_id: n.userId ? n.userId.toString() : '',
    title: n.title,
    message: n.message,
    type: n.type,
    read: Boolean(n.read),
    link: n.link,
    created_at: n.createdAt ? n.createdAt.toISOString() : new Date().toISOString(),
  };
}

export async function getNotifications(req: AuthRequest, res: Response) {
  try {
    const filter: any = {};
    if (req.user?.id) {
      filter.userId = req.user.id;
    }
    const notifications = await Notification.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, notifications: notifications.map(formatNotification) });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to fetch notifications' });
  }
}

export async function markRead(req: AuthRequest, res: Response) {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    return res.json({ success: true, notification: formatNotification(notification) });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to mark notification read' });
  }
}

export async function markAllRead(req: AuthRequest, res: Response) {
  try {
    const filter: any = {};
    if (req.user?.id) {
      filter.userId = req.user.id;
    }
    await Notification.updateMany(filter, { read: true });
    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to mark all read' });
  }
}

export async function createNotification(req: AuthRequest, res: Response) {
  try {
    const { title, message, type, link } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, error: 'Title and message are required' });
    }
    const notification = await Notification.create({
      userId: req.user?.id || '000000000000000000000000',
      title,
      message,
      type: type || 'info',
      link,
    });
    return res.status(201).json({ success: true, notification: formatNotification(notification) });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to create notification' });
  }
}
