import mongoose, { Document, Schema } from 'mongoose';

export type SocialPlatform = 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'tiktok' | 'youtube';
export type PostStatus = 'draft' | 'created' | 'customized' | 'queued' | 'waiting' | 'published' | 'failed' | 'reviewed';
export type MediaType = 'image' | 'video' | 'carousel' | 'text';

export interface IPlatformPostDraft {
  caption: string;
  hashtags?: string[];
  callToAction?: string;
  mediaUrl?: string;
}

export interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content?: string;
  caption: string;
  hashtags: string[];
  platforms: SocialPlatform[];
  status: PostStatus;
  media_urls: string[];
  media_type: MediaType;
  scheduled_for?: Date;
  published_at?: Date;
  error_message?: string;
  ai_generated: boolean;
  agent_id?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  platformVariations?: {
    instagram?: IPlatformPostDraft;
    facebook?: IPlatformPostDraft;
    linkedin?: IPlatformPostDraft;
    twitter?: IPlatformPostDraft;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PlatformPostDraftSchema = new Schema(
  {
    caption: { type: String, default: '' },
    hashtags: { type: [String], default: [] },
    callToAction: { type: String, default: '' },
    mediaUrl: { type: String, default: '' },
  },
  { _id: false }
);

const PostSchema = new Schema<IPost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    caption: {
      type: String,
      required: true,
    },
    hashtags: {
      type: [String],
      default: [],
    },
    platforms: {
      type: [String],
      enum: ['instagram', 'facebook', 'linkedin', 'twitter', 'tiktok', 'youtube'],
      default: ['instagram'],
    },
    status: {
      type: String,
      enum: ['draft', 'created', 'customized', 'queued', 'waiting', 'published', 'failed', 'reviewed'],
      default: 'draft',
      index: true,
    },
    media_urls: {
      type: [String],
      default: [],
    },
    media_type: {
      type: String,
      enum: ['image', 'video', 'carousel', 'text'],
      default: 'text',
    },
    scheduled_for: {
      type: Date,
    },
    published_at: {
      type: Date,
    },
    error_message: {
      type: String,
    },
    ai_generated: {
      type: Boolean,
      default: false,
    },
    agent_id: {
      type: String,
    },
    likes_count: {
      type: Number,
      default: 0,
    },
    comments_count: {
      type: Number,
      default: 0,
    },
    shares_count: {
      type: Number,
      default: 0,
    },
    platformVariations: {
      instagram: PlatformPostDraftSchema,
      facebook: PlatformPostDraftSchema,
      linkedin: PlatformPostDraftSchema,
      twitter: PlatformPostDraftSchema,
    },
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.model<IPost>('Post', PostSchema);
