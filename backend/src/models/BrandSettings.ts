import mongoose, { Document, Schema } from 'mongoose';

export interface IBrandSettings extends Document {
  userId: mongoose.Types.ObjectId;
  brand_name: string;
  tagline: string;
  category: string;
  target_audience: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_preference: string;
  tone_of_voice: string;
  default_hashtags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BrandSettingsSchema = new Schema<IBrandSettings>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    brand_name: {
      type: String,
      default: 'My Brand',
      trim: true,
    },
    tagline: {
      type: String,
      default: 'Innovate, Scale & Convert',
      trim: true,
    },
    category: {
      type: String,
      default: 'E-commerce & Retail',
    },
    target_audience: {
      type: String,
      default: 'Modern professionals and digital natives',
    },
    logo_url: {
      type: String,
      default: '',
    },
    primary_color: {
      type: String,
      default: '#4F46E5',
    },
    secondary_color: {
      type: String,
      default: '#06B6D4',
    },
    accent_color: {
      type: String,
      default: '#F59E0B',
    },
    font_preference: {
      type: String,
      default: 'Plus Jakarta Sans',
    },
    tone_of_voice: {
      type: String,
      default: 'Professional yet friendly',
    },
    default_hashtags: {
      type: [String],
      default: ['#ViroAI', '#SocialMedia', '#Growth'],
    },
  },
  {
    timestamps: true,
  }
);

export const BrandSettings = mongoose.model<IBrandSettings>('BrandSettings', BrandSettingsSchema);
