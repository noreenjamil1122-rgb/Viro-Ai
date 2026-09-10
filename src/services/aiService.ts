import { 
  GeneratedContentResult, 
  GeneratedStudioPostResult,
  GeneratedQuickCopyResult, 
  GeneratedImageResult, 
  GeneratedVideoResult,
  BrandSettings,
  SocialPlatform
} from '../types';

export const aiService = {
  // 0. Prompt-Driven Studio Post Generator
  async generateStudioPost(params: {
    prompt: string;
    platform?: SocialPlatform;
    tone?: string;
    length?: string;
    brandSettings?: BrandSettings;
  }): Promise<{ success: boolean; data: GeneratedStudioPostResult; source: string }> {
    const res = await fetch('/api/ai/studio-post-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate post');
    }

    return await res.json();
  },

  // 1. Content Generation Agent
  async generateContent(params: {
    productName: string;
    productDescription: string;
    keywords?: string;
    targetAudience?: string;
    marketingGoal?: string;
    platform?: SocialPlatform;
    tone?: string;
    customPrompt?: string;
    brandSettings?: BrandSettings;
  }): Promise<{ success: boolean; data: GeneratedContentResult; source: string }> {
    const res = await fetch('/api/ai/content-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate content');
    }

    return await res.json();
  },

  // 2. Quick Hashtag & Caption Generator
  async quickGenerate(params: {
    topic?: string;
    product?: string;
    niche?: string;
    keywords?: string;
    platform?: SocialPlatform;
    tone?: string;
  }): Promise<{ success: boolean; data: GeneratedQuickCopyResult; source: string }> {
    const res = await fetch('/api/ai/quick-generator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate quick captions and hashtags');
    }

    return await res.json();
  },

  // 3. AI Image Generation Agent
  async generateImage(params: {
    prompt: string;
    product?: string;
    style?: string;
    aspectRatio?: string;
  }): Promise<GeneratedImageResult> {
    const res = await fetch('/api/ai/image-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate promotional image');
    }

    return await res.json();
  },

  // 4. AI Video Generation Agent
  async generateVideo(params: {
    prompt?: string;
    product?: string;
    purpose?: string;
    duration?: number;
    style?: string;
    script?: string;
  }): Promise<GeneratedVideoResult> {
    const res = await fetch('/api/ai/video-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate video storyboard');
    }

    const data = await res.json();
    return {
      title: data.storyboard?.title || 'Video Spotlight',
      duration: data.storyboard?.duration || 15,
      scenes: data.storyboard?.scenes || [],
      videoUrl: data.videoUrl,
      thumbnailUrl: data.thumbnailUrl,
      status: 'ready',
    };
  },

  // 5. Competitor Analysis Agent
  async analyzeCompetitor(params: {
    competitorName: string;
    profileUrl: string;
    platform: SocialPlatform;
  }): Promise<any> {
    const res = await fetch('/api/ai/competitor-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to analyze competitor');
    }

    return await res.json();
  },

  // 6. Analytics Insights Agent
  async generateAnalyticsInsights(params: {
    metricsSummary?: any;
    topPosts?: any[];
  }): Promise<any> {
    const res = await fetch('/api/ai/analytics-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate analytics insights');
    }

    return await res.json();
  },

  // 7. Publishing Agent Service
  async publishPost(params: {
    postId: string;
    platforms: SocialPlatform[];
    title: string;
    caption: string;
    mediaUrls?: string[];
  }): Promise<any> {
    const res = await fetch('/api/social/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to publish post to social channels');
    }

    return await res.json();
  }
};
