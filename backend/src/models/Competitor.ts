import mongoose, { Document, Schema } from 'mongoose';

export interface ICompetitor extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  handle: string;
  platform: string;
  profile_url: string;
  avatar_url?: string;
  followers_count: number;
  following_count: number;
  posting_frequency: string;
  avg_engagement_rate: number;
  content_categories: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  recent_posts: any[];
  is_demo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CompetitorSchema = new Schema<ICompetitor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    handle: {
      type: String,
      required: true,
      trim: true,
    },
    platform: {
      type: String,
      required: true,
    },
    profile_url: {
      type: String,
      required: true,
    },
    avatar_url: {
      type: String,
      default: '',
    },
    followers_count: {
      type: Number,
      default: 0,
    },
    following_count: {
      type: Number,
      default: 0,
    },
    posting_frequency: {
      type: String,
      default: '3-4 posts/week',
    },
    avg_engagement_rate: {
      type: Number,
      default: 3.5,
    },
    content_categories: {
      type: [String],
      default: ['Promotional', 'Educational'],
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    recommendations: {
      type: [String],
      default: [],
    },
    recent_posts: {
      type: [Schema.Types.Mixed] as any,
      default: [],
    },
    is_demo: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Competitor = mongoose.model<ICompetitor>('Competitor', CompetitorSchema);
