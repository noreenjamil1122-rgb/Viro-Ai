import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalyticsMetric extends Document {
  userId: mongoose.Types.ObjectId;
  date: string;
  platform: string;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
  impressions: number;
  engagement_rate: number;
  follower_gain: number;
}

const AnalyticsMetricSchema = new Schema<IAnalyticsMetric>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: { type: String, required: true },
    platform: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    reach: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    engagement_rate: { type: Number, default: 0 },
    follower_gain: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

AnalyticsMetricSchema.index({ userId: 1, date: 1, platform: 1 });

export const AnalyticsMetric = mongoose.model<IAnalyticsMetric>('AnalyticsMetric', AnalyticsMetricSchema);
