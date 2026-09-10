import { 
  UserProfile, 
  BrandSettings, 
  SocialAccount, 
  Post, 
  Competitor, 
  AnalyticsMetric, 
  AgentActivity, 
  Template, 
  NotificationItem, 
  AiGeneration,
  SocialPlatform
} from '../types';

export const DEFAULT_BRAND_SETTINGS: BrandSettings = {
  id: 'brand-default',
  user_id: '',
  brand_name: '',
  tagline: '',
  category: '',
  target_audience: '',
  logo_url: '',
  primary_color: '#4F46E5',
  secondary_color: '#06B6D4',
  accent_color: '#F59E0B',
  font_preference: 'Plus Jakarta Sans',
  tone_of_voice: 'Professional and engaging',
  default_hashtags: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEFAULT_SOCIAL_ACCOUNTS: SocialAccount[] = [
  { id: 'soc-ig', user_id: '', platform: 'instagram', account_name: '', account_handle: '', connected: false, connected_at: '', followers_count: 0 },
  { id: 'soc-li', user_id: '', platform: 'linkedin', account_name: '', account_handle: '', connected: false, connected_at: '', followers_count: 0 },
  { id: 'soc-tw', user_id: '', platform: 'twitter', account_name: '', account_handle: '', connected: false, connected_at: '', followers_count: 0 },
  { id: 'soc-fb', user_id: '', platform: 'facebook', account_name: '', account_handle: '', connected: false, connected_at: '', followers_count: 0 },
  { id: 'soc-tt', user_id: '', platform: 'tiktok', account_name: '', account_handle: '', connected: false, connected_at: '', followers_count: 0 },
  { id: 'soc-yt', user_id: '', platform: 'youtube', account_name: '', account_handle: '', connected: false, connected_at: '', followers_count: 0 },
];

export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'tpl-1',
    title: 'Product Announcement & Launch',
    category: 'Product Showcase',
    description: 'Structure for announcing a new product, feature, or release with value propositions and call to action.',
    caption_template: 'Announce a new release for [Product Name]. Highlight the main problem it solves, 3 key benefits, and a clear call to action.',
    suggested_hashtags: ['#productlaunch', '#innovation', '#newfeature'],
    default_platforms: ['instagram', 'linkedin', 'twitter', 'facebook'],
    platforms: ['instagram', 'linkedin', 'twitter', 'facebook']
  },
  {
    id: 'tpl-2',
    title: 'Industry Insight & Thought Leadership',
    category: 'Educational',
    description: 'Framework for sharing actionable industry takeaways, frameworks, and strategic perspectives.',
    caption_template: 'Write an insightful analysis on [Topic]. Share 3 actionable lessons learned, common pitfalls to avoid, and an engaging question for comments.',
    suggested_hashtags: ['#thoughtleadership', '#insights', '#strategy'],
    default_platforms: ['linkedin', 'twitter'],
    platforms: ['linkedin', 'twitter']
  },
  {
    id: 'tpl-3',
    title: 'Seasonal Promo & Limited Offer',
    category: 'Seasonal Campaign',
    description: 'Create urgency and excitement around seasonal events, limited-time offers, or seasonal drops.',
    caption_template: 'Celebrate [Season/Occasion] with our exclusive limited-time offer. Get [Discount/Offer] when you use code [CODE].',
    suggested_hashtags: ['#specialoffer', '#limitedtime', '#deal'],
    default_platforms: ['instagram', 'facebook', 'tiktok'],
    platforms: ['instagram', 'facebook', 'tiktok']
  },
  {
    id: 'tpl-4',
    title: 'Business Milestone & Case Study',
    category: 'Business Promotion',
    description: 'Highlight measurable transformation, case studies, client testimonials, or corporate milestones.',
    caption_template: 'Proud to share how our team achieved [Milestone/Goal]. Key takeaway: [Insight]. Thank you to our community for the journey.',
    suggested_hashtags: ['#businessgrowth', '#milestone', '#casestudy'],
    default_platforms: ['linkedin', 'instagram', 'facebook'],
    platforms: ['linkedin', 'instagram', 'facebook']
  },
  {
    id: 'tpl-5',
    title: 'Live Event & Webinar Announcement',
    category: 'Event Announcement',
    description: 'High-engagement invitation for workshops, live streams, keynote speeches, or webinars.',
    caption_template: 'Join us live on [Date] at [Time] for [Event Name]. We will cover [Key Topic 1], [Key Topic 2], and live Q&A.',
    suggested_hashtags: ['#liveevent', '#webinar', '#workshop'],
    default_platforms: ['twitter', 'linkedin', 'instagram'],
    platforms: ['twitter', 'linkedin', 'instagram']
  }
];

// Local storage keys
const STORAGE_KEYS = {
  USER: 'viroai_user_profile',
  BRAND: 'viroai_brand_settings',
  SOCIAL_ACCOUNTS: 'viroai_social_accounts',
  POSTS: 'viroai_posts',
  COMPETITORS: 'viroai_competitors',
  ANALYTICS: 'viroai_analytics',
  AGENT_ACTIVITIES: 'viroai_agent_activities',
  TEMPLATES: 'viroai_templates',
  NOTIFICATIONS: 'viroai_notifications',
  ALL_USERS: 'viroai_admin_users',
};

// Automatic one-time purge of any stale mock/dummy data stored in previous browser sessions
(() => {
  if (typeof window !== 'undefined') {
    try {
      const purged = localStorage.getItem('viroai_clean_v4');
      if (!purged) {
        localStorage.removeItem(STORAGE_KEYS.POSTS);
        localStorage.removeItem(STORAGE_KEYS.SOCIAL_ACCOUNTS);
        localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
        localStorage.removeItem(STORAGE_KEYS.AGENT_ACTIVITIES);
        localStorage.removeItem(STORAGE_KEYS.COMPETITORS);
        localStorage.removeItem(STORAGE_KEYS.ANALYTICS);
        localStorage.removeItem(STORAGE_KEYS.ALL_USERS);
        localStorage.setItem('viroai_clean_v4', 'true');
      }
    } catch (e) {
      console.warn('Storage purge exception:', e);
    }
  }
})();

function getLocal<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(item);
  } catch {
    return defaultVal;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('LocalStorage write failed:', e);
  }
}

async function apiCall<T>(url: string, method = 'GET', body?: any): Promise<T | null> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('viroai_auth_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export const dbService = {
  // ----------------------------------------------------
  // AUTH & PROFILE
  // ----------------------------------------------------
  async getProfile(userId?: string): Promise<UserProfile | null> {
    const apiRes = await apiCall<{ success: boolean; user: UserProfile }>('/api/auth/me');
    if (apiRes?.success && apiRes.user) {
      setLocal(STORAGE_KEYS.USER, apiRes.user);
      return apiRes.user;
    }
    return getLocal<UserProfile | null>(STORAGE_KEYS.USER, null);
  },

  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const apiRes = await apiCall<{ success: boolean; user: UserProfile }>('/api/auth/profile', 'PUT', profile);
    if (apiRes?.success && apiRes.user) {
      setLocal(STORAGE_KEYS.USER, apiRes.user);
      return apiRes.user;
    }

    const current = await this.getProfile();
    const targetUid = profile.id || current?.id || `usr-${Date.now()}`;
    const updated: UserProfile = {
      id: targetUid,
      email: profile.email || current?.email || 'user@viroai.com',
      full_name: profile.full_name || current?.full_name || 'User',
      avatar_url: profile.avatar_url ?? current?.avatar_url ?? undefined,
      created_at: current?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...profile,
    };

    setLocal(STORAGE_KEYS.USER, updated);
    return updated;
  },

  // ----------------------------------------------------
  // BRAND SETTINGS
  // ----------------------------------------------------
  async getBrandSettings(userId?: string): Promise<BrandSettings> {
    const apiRes = await apiCall<{ success: boolean; brandSettings: BrandSettings }>('/api/brand');
    if (apiRes?.success && apiRes.brandSettings) {
      setLocal(STORAGE_KEYS.BRAND, apiRes.brandSettings);
      return apiRes.brandSettings;
    }
    return getLocal<BrandSettings>(STORAGE_KEYS.BRAND, DEFAULT_BRAND_SETTINGS);
  },

  async saveBrandSettings(settings: Partial<BrandSettings>): Promise<BrandSettings> {
    const apiRes = await apiCall<{ success: boolean; brandSettings: BrandSettings }>('/api/brand', 'PUT', settings);
    if (apiRes?.success && apiRes.brandSettings) {
      setLocal(STORAGE_KEYS.BRAND, apiRes.brandSettings);
      return apiRes.brandSettings;
    }
    const current = await this.getBrandSettings();
    const updated: BrandSettings = {
      ...current,
      ...settings,
      user_id: current.user_id || 'usr-current',
      updated_at: new Date().toISOString(),
    };

    setLocal(STORAGE_KEYS.BRAND, updated);
    return updated;
  },

  // ----------------------------------------------------
  // SOCIAL ACCOUNTS
  // ----------------------------------------------------
  async getSocialAccounts(): Promise<SocialAccount[]> {
    const apiRes = await apiCall<{ success: boolean; accounts: SocialAccount[] }>('/api/social/accounts');
    if (apiRes?.success && apiRes.accounts && apiRes.accounts.length > 0) {
      setLocal(STORAGE_KEYS.SOCIAL_ACCOUNTS, apiRes.accounts);
      return apiRes.accounts;
    }

    const accounts = getLocal<SocialAccount[]>(STORAGE_KEYS.SOCIAL_ACCOUNTS, DEFAULT_SOCIAL_ACCOUNTS);
    const sanitized = accounts.map(a => {
      if (['soc-1', 'soc-2', 'soc-3', 'soc-4', 'soc-5', 'soc-6'].includes(a.id) || a.account_name === 'ViroAI Official') {
        const def = DEFAULT_SOCIAL_ACCOUNTS.find(d => d.platform === a.platform);
        return def || a;
      }
      return a;
    });
    return sanitized;
  },

  async toggleSocialConnection(platform: SocialPlatform, connect: boolean, accountName?: string, handle?: string): Promise<SocialAccount[]> {
    await apiCall<{ success: boolean; account: SocialAccount }>('/api/social/connect', 'POST', {
      platform,
      connect,
      account_name: accountName,
      account_handle: handle,
    });
    const accounts = await this.getSocialAccounts();
    const updated = accounts.map(acc => {
      if (acc.platform === platform) {
        return {
          ...acc,
          connected: connect,
          connected_at: connect ? new Date().toISOString() : '',
          account_name: connect ? (accountName || acc.account_name || `${platform.charAt(0).toUpperCase() + platform.slice(1)} Account`) : '',
          account_handle: connect ? (handle || acc.account_handle || `@${platform}_account`) : '',
          followers_count: connect ? (acc.followers_count || 0) : 0,
        };
      }
      return acc;
    });

    setLocal(STORAGE_KEYS.SOCIAL_ACCOUNTS, updated);
    return updated;
  },

  // ----------------------------------------------------
  // POSTS & DRAFTS
  // ----------------------------------------------------
  async getPosts(): Promise<Post[]> {
    const apiRes = await apiCall<{ success: boolean; posts: Post[] }>('/api/posts');
    if (apiRes?.success && apiRes.posts) {
      setLocal(STORAGE_KEYS.POSTS, apiRes.posts);
      return apiRes.posts;
    }

    const postsList = getLocal<Post[]>(STORAGE_KEYS.POSTS, []);
    return postsList.filter(p => !['post-1', 'post-2', 'post-3', 'post-4', 'post-5', 'post-6'].includes(p.id));
  },

  async getPostById(id: string): Promise<Post | undefined> {
    const posts = await this.getPosts();
    return posts.find(p => p.id === id);
  },

  async createPost(postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<Post> {
    const apiRes = await apiCall<{ success: boolean; post: Post }>('/api/posts', 'POST', postData);
    if (apiRes?.success && apiRes.post) {
      const posts = getLocal<Post[]>(STORAGE_KEYS.POSTS, []);
      setLocal(STORAGE_KEYS.POSTS, [apiRes.post, ...posts]);
      return apiRes.post;
    }

    const newPost: Post = {
      ...postData,
      user_id: postData.user_id || 'usr-current',
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const posts = getLocal<Post[]>(STORAGE_KEYS.POSTS, []);
    const updated = [newPost, ...posts];
    setLocal(STORAGE_KEYS.POSTS, updated);

    if (newPost.ai_generated) {
      await this.logAgentActivity({
        agent_name: 'Content Generation Agent',
        agent_type: 'content',
        action: `Created new ${newPost.media_type} post: "${newPost.title.slice(0, 30)}"`,
        status: 'success',
        details: `Saved to ${newPost.status} state with ${newPost.platforms.length} connected platforms`,
        execution_time_ms: 850,
      });
    }

    return newPost;
  },

  async updatePost(id: string, updates: Partial<Post>): Promise<Post> {
    const apiRes = await apiCall<{ success: boolean; post: Post }>(`/api/posts/${id}`, 'PUT', updates);
    if (apiRes?.success && apiRes.post) {
      const posts = getLocal<Post[]>(STORAGE_KEYS.POSTS, []);
      const updated = posts.map(p => p.id === id ? apiRes.post : p);
      setLocal(STORAGE_KEYS.POSTS, updated);
      return apiRes.post;
    }

    const posts = await this.getPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Post not found');

    const updatedPost: Post = {
      ...posts[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    posts[index] = updatedPost;
    setLocal(STORAGE_KEYS.POSTS, posts);
    return updatedPost;
  },

  async deletePost(id: string): Promise<boolean> {
    await apiCall(`/api/posts/${id}`, 'DELETE');
    const posts = await this.getPosts();
    const filtered = posts.filter(p => p.id !== id);
    setLocal(STORAGE_KEYS.POSTS, filtered);
    return true;
  },

  // ----------------------------------------------------
  // COMPETITORS
  // ----------------------------------------------------
  async getCompetitors(): Promise<Competitor[]> {
    const apiRes = await apiCall<{ success: boolean; competitors: Competitor[] }>('/api/competitors');
    if (apiRes?.success && apiRes.competitors) {
      setLocal(STORAGE_KEYS.COMPETITORS, apiRes.competitors);
      return apiRes.competitors;
    }

    const comps = getLocal<Competitor[]>(STORAGE_KEYS.COMPETITORS, []);
    return comps.filter(c => !['comp-1', 'comp-2'].includes(c.id));
  },

  async saveCompetitor(competitor: Omit<Competitor, 'id' | 'created_at'>): Promise<Competitor> {
    const apiRes = await apiCall<{ success: boolean; competitor: Competitor }>('/api/competitors', 'POST', competitor);
    if (apiRes?.success && apiRes.competitor) {
      const comps = getLocal<Competitor[]>(STORAGE_KEYS.COMPETITORS, []);
      setLocal(STORAGE_KEYS.COMPETITORS, [apiRes.competitor, ...comps]);
      return apiRes.competitor;
    }

    const newComp: Competitor = {
      ...competitor,
      user_id: competitor.user_id || 'usr-current',
      id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      created_at: new Date().toISOString(),
    };

    const comps = getLocal<Competitor[]>(STORAGE_KEYS.COMPETITORS, []);
    const updated = [newComp, ...comps];
    setLocal(STORAGE_KEYS.COMPETITORS, updated);

    await this.logAgentActivity({
      agent_name: 'Competitor Analysis Agent',
      agent_type: 'competitor',
      action: `Competitor Benchmarking: ${newComp.name}`,
      status: 'success',
      details: `Generated strategic SWOT breakdown and engagement score for ${newComp.handle}`,
      execution_time_ms: 1420,
    });

    return newComp;
  },

  async deleteCompetitor(id: string): Promise<boolean> {
    await apiCall(`/api/competitors/${id}`, 'DELETE');
    const comps = await this.getCompetitors();
    const filtered = comps.filter(c => c.id !== id);
    setLocal(STORAGE_KEYS.COMPETITORS, filtered);
    return true;
  },

  // ----------------------------------------------------
  // ANALYTICS METRICS
  // ----------------------------------------------------
  async getAnalytics(): Promise<AnalyticsMetric[]> {
    const apiRes = await apiCall<{ success: boolean; metrics: AnalyticsMetric[] }>('/api/analytics/metrics');
    if (apiRes?.success && apiRes.metrics && apiRes.metrics.length > 0) {
      setLocal(STORAGE_KEYS.ANALYTICS, apiRes.metrics);
      return apiRes.metrics;
    }
    return getLocal<AnalyticsMetric[]>(STORAGE_KEYS.ANALYTICS, []);
  },

  // ----------------------------------------------------
  // AGENT ACTIVITIES
  // ----------------------------------------------------
  async getAgentActivities(): Promise<AgentActivity[]> {
    const apiRes = await apiCall<{ success: boolean; activities: AgentActivity[] }>('/api/analytics/activities');
    if (apiRes?.success && apiRes.activities && apiRes.activities.length > 0) {
      setLocal(STORAGE_KEYS.AGENT_ACTIVITIES, apiRes.activities);
      return apiRes.activities;
    }

    const acts = getLocal<AgentActivity[]>(STORAGE_KEYS.AGENT_ACTIVITIES, []);
    return acts.filter(a => !['act-1', 'act-2', 'act-3', 'act-4', 'act-5', 'act-6'].includes(a.id));
  },

  async logAgentActivity(activity: Omit<AgentActivity, 'id' | 'user_id' | 'created_at'>): Promise<AgentActivity> {
    const newAct: AgentActivity = {
      ...activity,
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      user_id: 'usr-current',
      created_at: new Date().toISOString(),
    };

    const acts = getLocal<AgentActivity[]>(STORAGE_KEYS.AGENT_ACTIVITIES, []);
    const updated = [newAct, ...acts].slice(0, 30);
    setLocal(STORAGE_KEYS.AGENT_ACTIVITIES, updated);
    return newAct;
  },

  // ----------------------------------------------------
  // TEMPLATES
  // ----------------------------------------------------
  async getTemplates(): Promise<Template[]> {
    const apiRes = await apiCall<{ success: boolean; templates: Template[] }>('/api/templates');
    if (apiRes?.success && apiRes.templates && apiRes.templates.length > 0) {
      setLocal(STORAGE_KEYS.TEMPLATES, apiRes.templates);
      return apiRes.templates;
    }
    return getLocal<Template[]>(STORAGE_KEYS.TEMPLATES, DEFAULT_TEMPLATES);
  },

  // ----------------------------------------------------
  // NOTIFICATIONS
  // ----------------------------------------------------
  async getNotifications(): Promise<NotificationItem[]> {
    const apiRes = await apiCall<{ success: boolean; notifications: NotificationItem[] }>('/api/notifications');
    if (apiRes?.success && apiRes.notifications) {
      setLocal(STORAGE_KEYS.NOTIFICATIONS, apiRes.notifications);
      return apiRes.notifications;
    }

    const notifs = getLocal<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    return notifs.filter(n => !['notif-1', 'notif-2', 'notif-3', 'notif-4'].includes(n.id) && !n.id.startsWith('mock-'));
  },

  async markNotificationAsRead(id: string): Promise<void> {
    await apiCall(`/api/notifications/${id}/read`, 'PUT');
    const notifs = await this.getNotifications();
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    setLocal(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  async markAllNotificationsAsRead(): Promise<void> {
    await apiCall('/api/notifications/read-all', 'PUT');
    const notifs = await this.getNotifications();
    const updated = notifs.map(n => ({ ...n, read: true }));
    setLocal(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  async addNotification(notif: Omit<NotificationItem, 'id' | 'user_id' | 'created_at' | 'read'>): Promise<NotificationItem> {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      user_id: 'usr-current',
      read: false,
      created_at: new Date().toISOString(),
    };

    const notifs = await this.getNotifications();
    const updated = [newNotif, ...notifs];
    setLocal(STORAGE_KEYS.NOTIFICATIONS, updated);
    return newNotif;
  },

  // ----------------------------------------------------
  // WORKSPACE USERS & SYSTEM STATS
  // ----------------------------------------------------
  async getAdminUsers(): Promise<UserProfile[]> {
    const current = await this.getProfile();
    return current ? [current] : [];
  }
};
