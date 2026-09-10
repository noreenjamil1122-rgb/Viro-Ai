import mongoose, { Document, Schema } from 'mongoose';

export interface ISocialAccount extends Document {
  userId: mongoose.Types.ObjectId;
  platform: 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'tiktok' | 'youtube';
  account_name: string;
  account_handle: string;
  profile_picture?: string;
  connected: boolean;
  connected_at?: Date;
  followers_count: number;
}

const SocialAccountSchema = new Schema<ISocialAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    platform: {
      type: String,
      enum: ['instagram', 'facebook', 'linkedin', 'twitter', 'tiktok', 'youtube'],
      required: true,
    },
    account_name: {
      type: String,
      default: '',
    },
    account_handle: {
      type: String,
      default: '',
    },
    profile_picture: {
      type: String,
      default: '',
    },
    connected: {
      type: Boolean,
      default: false,
    },
    connected_at: {
      type: Date,
    },
    followers_count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

SocialAccountSchema.index({ userId: 1, platform: 1 }, { unique: true });

export const SocialAccount = mongoose.model<ISocialAccount>('SocialAccount', SocialAccountSchema);
