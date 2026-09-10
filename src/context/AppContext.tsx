import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  BrandSettings, 
  SocialAccount, 
  Post, 
  Competitor, 
  AgentActivity, 
  Template, 
  NotificationItem,
  SocialPlatform,
  PostStatus
} from '../types';
import { dbService, DEFAULT_BRAND_SETTINGS } from '../services/dbService';

export type AppView = 
  | 'landing'
  | 'auth'
  | 'dashboard'
  | 'agents'
  | 'content-agent'
  | 'quick-generator'
  | 'image-agent'
  | 'video-agent'
  | 'competitor-analysis'
  | 'create-post'
  | 'manual-upload'
  | 'scheduler'
  | 'post-history'
  | 'templates'
  | 'integrations'
  | 'analytics'
  | 'reports'
  | 'brand-settings'
  | 'notifications'
  | 'settings'
  | 'admin';

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  brandSettings: BrandSettings;
  posts: Post[];
  socialAccounts: SocialAccount[];
  competitors: Competitor[];
  agentActivities: AgentActivity[];
  templates: Template[];
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  // Actions
  refreshAllData: () => Promise<void>;
  createPost: (postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => Promise<Post>;
  updatePost: (id: string, updates: Partial<Post>) => Promise<Post>;
  deletePost: (id: string) => Promise<boolean>;
  saveBrandSettings: (settings: Partial<BrandSettings>) => Promise<BrandSettings>;
  toggleSocialConnection: (platform: SocialPlatform, connect: boolean, name?: string, handle?: string) => Promise<void>;
  addCompetitor: (competitor: Omit<Competitor, 'id' | 'created_at'>) => Promise<Competitor>;
  deleteCompetitor: (id: string) => Promise<boolean>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  addNotification: (title: string, message: string, type?: 'success' | 'warning' | 'info' | 'error', link?: string) => Promise<void>;
  // Active editing helpers
  editingPost: Post | null;
  setEditingPost: (post: Post | null) => void;
  prefilledContent: any | null;
  setPrefilledContent: (data: any | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(DEFAULT_BRAND_SETTINGS);
  const [posts, setPosts] = useState<Post[]>([]);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [agentActivities, setAgentActivities] = useState<AgentActivity[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [prefilledContent, setPrefilledContent] = useState<any | null>(null);

  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('viroai_theme');
      return (saved === 'light' || saved === 'dark') ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  const setTheme = (t: 'dark' | 'light') => {
    setThemeState(t);
    localStorage.setItem('viroai_theme', t);
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const refreshAllData = useCallback(async () => {
    try {
      const [b, p, s, c, a, t, n] = await Promise.all([
        dbService.getBrandSettings(),
        dbService.getPosts(),
        dbService.getSocialAccounts(),
        dbService.getCompetitors(),
        dbService.getAgentActivities(),
        dbService.getTemplates(),
        dbService.getNotifications(),
      ]);
      setBrandSettings(b);
      setPosts(p);
      setSocialAccounts(s);
      setCompetitors(c);
      setAgentActivities(a);
      setTemplates(t);
      setNotifications(n);
    } catch (e) {
      console.error('Failed to load application data:', e);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  const createPost = async (postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => {
    const newPost = await dbService.createPost(postData);
    await refreshAllData();
    return newPost;
  };

  const updatePost = async (id: string, updates: Partial<Post>) => {
    const updated = await dbService.updatePost(id, updates);
    await refreshAllData();
    return updated;
  };

  const deletePost = async (id: string) => {
    const res = await dbService.deletePost(id);
    await refreshAllData();
    return res;
  };

  const saveBrandSettings = async (settings: Partial<BrandSettings>) => {
    const updated = await dbService.saveBrandSettings(settings);
    setBrandSettings(updated);
    return updated;
  };

  const toggleSocialConnection = async (platform: SocialPlatform, connect: boolean, name?: string, handle?: string) => {
    const updated = await dbService.toggleSocialConnection(platform, connect, name, handle);
    setSocialAccounts(updated);
  };

  const addCompetitor = async (competitor: Omit<Competitor, 'id' | 'created_at'>) => {
    const newComp = await dbService.saveCompetitor(competitor);
    await refreshAllData();
    return newComp;
  };

  const deleteCompetitor = async (id: string) => {
    const res = await dbService.deleteCompetitor(id);
    await refreshAllData();
    return res;
  };

  const markNotificationRead = async (id: string) => {
    await dbService.markNotificationAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = async () => {
    await dbService.markAllNotificationsAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = async (title: string, message: string, type: 'success' | 'warning' | 'info' | 'error' = 'info', link?: string) => {
    const newNotif = await dbService.addNotification({ title, message, type, link });
    setNotifications(prev => [newNotif, ...prev]);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      currentView,
      setCurrentView,
      brandSettings,
      posts,
      socialAccounts,
      competitors,
      agentActivities,
      templates,
      notifications,
      unreadNotificationsCount,
      theme,
      setTheme,
      toggleTheme,
      refreshAllData,
      createPost,
      updatePost,
      deletePost,
      saveBrandSettings,
      toggleSocialConnection,
      addCompetitor,
      deleteCompetitor,
      markNotificationRead,
      markAllNotificationsRead,
      addNotification,
      editingPost,
      setEditingPost,
      prefilledContent,
      setPrefilledContent,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
