export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface BrandSettings {
  id: string;
  user_id: string;
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
  created_at: string;
  updated_at: string;
}

export type SocialPlatform = 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'tiktok' | 'youtube';

export interface SocialAccount {
  id: string;
  user_id: string;
  platform: SocialPlatform;
  account_name: string;
  account_handle: string;
  profile_picture?: string;
  connected: boolean;
  connected_at: string;
  followers_count: number;
}

export type PostStatus = 
  | 'draft' 
  | 'created' 
  | 'customized' 
  | 'queued' 
  | 'waiting' 
  | 'scheduled'
  | 'published' 
  | 'failed' 
  | 'reviewed';

export type MediaType = 'image' | 'video' | 'carousel' | 'text';

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  caption: string;
  hashtags: string[];
  platforms: SocialPlatform[];
  status: PostStatus;
  media_urls: string[];
  media_type: MediaType;
  scheduled_for?: string | null;
  published_at?: string | null;
  error_message?: string | null;
  ai_generated: boolean;
  agent_id?: string;
  likes_count?: number;
  comments_count?: number;
  shares_count?: number;
  created_at: string;
  updated_at: string;
}

export type AgentType = 
  | 'content' 
  | 'image' 
  | 'video' 
  | 'competitor' 
  | 'scheduling' 
  | 'publishing' 
  | 'analytics' 
  | 'hashtag';

export interface AiGeneration {
  id: string;
  user_id: string;
  agent_type: AgentType;
  prompt: string;
  inputs: Record<string, any>;
  output_data: any;
  created_at: string;
}

export interface CompetitorPost {
  id: string;
  caption: string;
  media_url?: string;
  likes: number;
  comments: number;
  shares: number;
  date: string;
  engagement_rate: number;
}

export interface Competitor {
  id: string;
  user_id: string;
  name: string;
  handle: string;
  platform: SocialPlatform;
  profile_url: string;
  avatar_url?: string;
  followers_count: number;
  following_count: number;
  posting_frequency: string; // e.g. "4.2 posts/week"
  avg_engagement_rate: number; // e.g. 4.8%
  content_categories: string[];
  strengths: string[];
  weaknesses: string[];
  opportunities?: string[];
  threats?: string[];
  recommendations: string[];
  recent_posts: CompetitorPost[];
  is_demo: boolean;
  created_at: string;
}

export interface AnalyticsMetric {
  id: string;
  user_id: string;
  date: string;
  platform: SocialPlatform;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
  impressions: number;
  engagement_rate: number;
  follower_gain: number;
}

export interface AgentActivity {
  id: string;
  user_id: string;
  agent_name: string;
  agent_type: AgentType;
  action: string;
  status: 'success' | 'failed' | 'running' | 'idle';
  details: string;
  execution_time_ms: number;
  created_at: string;
}

export interface Template {
  id: string;
  title: string;
  category: 'Business Promotion' | 'Educational' | 'Event Announcement' | 'Seasonal Campaign' | 'Product Showcase';
  description: string;
  caption_template: string;
  suggested_hashtags: string[];
  default_hashtags?: string[];
  default_platforms: SocialPlatform[];
  platforms?: SocialPlatform[];
  preview_image?: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  read: boolean;
  link?: string;
  created_at: string;
}

export interface GeneratedContentResult {
  shortCaptions: string[];
  longCaptions: string[];
  hashtags: string[];
  postAngles: string[];
  promotionalCopy: string;
  videoScriptIdea: {
    hook: string;
    body: string[];
    callToAction: string;
  };
  callToActionOptions: string[];
  toneAnalysis?: string;
}

export interface PlatformPostDraft {
  caption: string;
  hashtags: string[];
  callToAction: string;
}

export interface GeneratedStudioPostResult {
  title: string;
  caption: string;
  hashtags: string[];
  callToAction: string;
  mediaSuggestion?: string;
  platformVariations?: {
    instagram?: PlatformPostDraft;
    facebook?: PlatformPostDraft;
    linkedin?: PlatformPostDraft;
    twitter?: PlatformPostDraft;
  };
}

export interface GeneratedQuickCopyResult {
  shortCaptions: string[];
  longCaptions: string[];
  hashtags: string[];
  contentSuggestions: string[];
}

export interface GeneratedImageResult {
  imageUrl: string;
  promptUsed: string;
  aspectRatio: string;
  style: string;
  source: 'gemini' | 'canvas' | 'preset';
}

export interface GeneratedVideoResult {
  title: string;
  duration: number; // in seconds
  scenes: {
    sceneNumber: number;
    visualDescription: string;
    scriptNarration: string;
    onScreenText: string;
    musicVibe: string;
  }[];
  videoUrl?: string;
  thumbnailUrl?: string;
  status: 'completed' | 'processing' | 'ready';
}
