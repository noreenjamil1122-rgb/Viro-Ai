import mongoose, { Document, Schema } from 'mongoose';

export interface ITemplate extends Document {
  title: string;
  category: string;
  description: string;
  caption_template: string;
  suggested_hashtags: string[];
  default_platforms: string[];
  preview_image?: string;
  is_custom: boolean;
  userId?: mongoose.Types.ObjectId;
}

const TemplateSchema = new Schema<ITemplate>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, default: '' },
    caption_template: { type: String, required: true },
    suggested_hashtags: { type: [String], default: [] },
    default_platforms: { type: [String], default: ['instagram'] },
    preview_image: { type: String, default: '' },
    is_custom: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

export const Template = mongoose.model<ITemplate>('Template', TemplateSchema);
