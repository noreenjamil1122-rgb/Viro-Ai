import React from 'react';
import { 
  Sparkles, 
  PenTool, 
  UploadCloud, 
  ImageIcon, 
  Video, 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  Share2, 
  Clock, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  Bot, 
  Flame,
  Plus, 
  Play,
  ExternalLink,
  ChevronRight,
  Hash,
  FileEdit,
  Radio
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Post } from '../types';

export const DashboardView: React.FC = () => {
  const { 
    posts, 
    socialAccounts, 
    agentActivities, 
    brandSettings, 
    setCurrentView,
    setEditingPost
  } = useApp();

  const { user } = useAuth();

  const userName = user?.full_name || (user?.email ? user.email.split('@')[0] : 'Creator');

  // Metric aggregates
  const totalPosts = posts.length;
  const draftPostsList = posts.filter(p => p.status === 'draft');
  const draftPostsCount = draftPostsList.length;
  
  const scheduledPostsList = posts.filter(p => p.status === 'scheduled' || p.status === 'queued');
  const scheduledPostsCount = scheduledPostsList.length;
  
  const publishedPostsList = posts.filter(p => p.status === 'published');
  const publishedPostsCount = publishedPostsList.length;
  
  const connectedAccountsCount = socialAccounts.filter(s => s.connected).length;
  const aiGeneratedCount = posts.filter(p => p.ai_generated).length;

  // Calculate posts scheduled for current week
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
  const scheduledThisWeek = scheduledPostsList.filter(p => {
    if (!p.scheduled_for) return false;
    const d = new Date(p.scheduled_for);
    return d >= startOfWeek && d <= endOfWeek;
  }).length;

  const handleResumeDraft = (draft: Post) => {
    setEditingPost(draft);
    setCurrentView('create-post');
  };

  // Platform color & label mapping
  const platformColorMap: Record<string, string> = {
    instagram: '#E1306C',
    linkedin: '#0A66C2',
    twitter: '#1DA1F2',
    facebook: '#1877F2',
    tiktok: '#000000',
    youtube: '#FF0000'
  };

  const platformLabels: Record<string, string> = {
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    twitter: 'Twitter/X',
    facebook: 'Facebook',
    tiktok: 'TikTok',
    youtube: 'YouTube'
  };

  const platformCounts = posts.reduce<Record<string, number>>((acc, post) => {
    post.platforms.forEach(pl => {
      acc[pl] = (acc[pl] || 0) + 1;
    });
    return acc;
  }, {});

  const totalPlatformEntries = Object.values(platformCounts).reduce<number>((a: number, b: number) => a + b, 0);

  const platformData = Object.entries(platformCounts).map(([platform, count]) => ({
    name: platformLabels[platform] || platform,
    value: totalPlatformEntries > 0 ? Math.round(((count as number) / totalPlatformEntries) * 100) : 0,
    color: platformColorMap[platform] || '#7C3AED'
  }));

  // Dynamic engagement trend data from real posts
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const engagementTrendData = daysOfWeek.map(day => {
    const dayPosts = posts.filter(p => {
      const d = new Date(p.created_at);
      return daysOfWeek[d.getDay()] === day;
    });
    const likes = dayPosts.reduce((acc, p) => acc + (p.likes_count || 0), 0);
    const reach = dayPosts.reduce((acc, p) => acc + ((p.likes_count || 0) * 10 + (p.shares_count || 0) * 20), 0);
    return {
      day,
      reach: reach,
      likes: likes,
      postsCount: dayPosts.length
    };
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header / Welcome Banner matching reference Figures 5.3 & 5.4 */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                ViroAI
              </span>
              <span className="text-xs text-zinc-400">• Workspace Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1.5">
              Hello, {userName}!
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              {scheduledThisWeek === 0 
                ? 'You have 0 posts scheduled for this week.' 
                : `You have ${scheduledThisWeek} post${scheduledThisWeek > 1 ? 's' : ''} scheduled for this week.`}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="btn-dash-create-post"
              onClick={() => {
                setEditingPost(null);
                setCurrentView('create-post');
              }}
              className="flex items-center gap-2 rounded-xl bg-purple-800 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-purple-700 transition-all active:scale-98 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Create Post</span>
            </button>
            <button
              id="btn-dash-schedule"
              onClick={() => setCurrentView('scheduler')}
              className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span>Calendar</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Grid matching reference Figure 5.3 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {[
          { 
            label: 'TOTAL POSTS', 
            value: totalPosts, 
            sublabel: totalPosts === 0 ? 'No posts yet' : 'In workspace', 
            icon: Flame, 
            color: 'text-purple-700 dark:text-purple-400' 
          },
          { 
            label: 'SCHEDULED', 
            value: scheduledPostsCount, 
            sublabel: scheduledPostsCount === 0 ? '0 Scheduled' : 'In queue', 
            icon: Calendar, 
            color: 'text-amber-600 dark:text-amber-400' 
          },
          { 
            label: 'PUBLISHED', 
            value: publishedPostsCount, 
            sublabel: publishedPostsCount === 0 ? '0 Published' : 'Live on channels', 
            icon: CheckCircle2, 
            color: 'text-emerald-600 dark:text-emerald-400' 
          },
          { 
            label: 'SAVED DRAFTS', 
            value: draftPostsCount, 
            sublabel: draftPostsCount === 0 ? '0 Drafts' : 'In progress', 
            icon: PenTool, 
            color: 'text-blue-600 dark:text-blue-400' 
          },
          { 
            label: 'CHANNELS', 
            value: connectedAccountsCount, 
            sublabel: connectedAccountsCount === 0 ? '0 Connected' : `${connectedAccountsCount} active`, 
            icon: Share2, 
            color: 'text-indigo-600 dark:text-indigo-400' 
          },
          { 
            label: 'AI GENERATIONS', 
            value: aiGeneratedCount, 
            sublabel: aiGeneratedCount === 0 ? '0 Generated' : 'AI-crafted posts', 
            icon: Sparkles, 
            color: 'text-purple-600 dark:text-purple-400' 
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/70">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
                  {stat.label}
                </span>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mt-2">
                {stat.value}
              </p>
              <span className="text-[10px] text-zinc-400 font-medium">{stat.sublabel}</span>
            </div>
          );
        })}
      </div>

      {/* 3. Quick Actions matching reference Figure 5.4 */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Quick Actions
          </h2>
          <span className="text-[11px] text-zinc-400">Launch creators & tools</span>
        </div>

        {/* Featured Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Featured Hero 1: Create Post (Figure 5.4) */}
          <div
            id="quick-card-create-post"
            onClick={() => {
              setEditingPost(null);
              setCurrentView('create-post');
            }}
            className="group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-purple-800 via-purple-900 to-indigo-950 p-6 text-white shadow-md hover:shadow-xl hover:scale-[1.01] transition-all"
          >
            <div className="relative z-10 flex flex-col justify-between h-full min-h-[140px]">
              <div>
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-xs mb-3">
                  <PenTool className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">Create Post</h3>
                <p className="text-xs text-purple-200 mt-1 max-w-xs">
                  Design and schedule your next viral hit with Gemini AI
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white/90 group-hover:text-white group-hover:translate-x-1 transition-all mt-4">
                <span>Start Creating</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          {/* Featured Hero 2: AI Agents Hub (Figure 5.4) */}
          <div
            id="quick-card-agents-hub"
            onClick={() => setCurrentView('agents')}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-purple-200 bg-purple-50/70 p-6 text-zinc-900 shadow-xs hover:shadow-md hover:scale-[1.01] transition-all dark:border-purple-900/60 dark:bg-purple-950/40 dark:text-white"
          >
            <div className="relative z-10 flex flex-col justify-between h-full min-h-[140px]">
              <div>
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-purple-800 text-white shadow-xs mb-3">
                  <Bot className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">AI Agents</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">
                  Get expert help from specialized AI for content, images & strategy
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-700 dark:text-purple-400 group-hover:translate-x-1 transition-all mt-4">
                <span>Explore Agents</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          {/* Tool Card 3: Image Generator */}
          <div
            onClick={() => setCurrentView('image-agent')}
            className="group cursor-pointer rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs hover:border-purple-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70 dark:hover:border-purple-800 transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 mb-3">
              <ImageIcon className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Image Generator</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Generate commercial visuals and social banners
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-4 group-hover:translate-x-0.5 transition-transform">
              Generate Image →
            </span>
          </div>

          {/* Tool Card 4: Video Generator */}
          <div
            onClick={() => setCurrentView('video-agent')}
            className="group cursor-pointer rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs hover:border-purple-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70 dark:hover:border-purple-800 transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400 mb-3">
              <Video className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Video Generator</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Create scripted storyboards & short video prompts
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 mt-4 group-hover:translate-x-0.5 transition-transform">
              Create Video Script →
            </span>
          </div>

        </div>
      </div>

      {/* 4. Desktop Main Flow Grid: Left (Drafts & Scheduled) | Right (Channels & Post History) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Saved Drafts & Scheduled Posts (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Saved Drafts (Figure 5.5) */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/70">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileEdit className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Saved Drafts</h3>
                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  {draftPostsCount} Draft{draftPostsCount === 1 ? '' : 's'}
                </span>
              </div>
              <button
                onClick={() => {
                  setEditingPost(null);
                  setCurrentView('create-post');
                }}
                className="text-xs font-semibold text-purple-700 dark:text-purple-400 hover:underline cursor-pointer"
              >
                + New Draft
              </button>
            </div>

            {draftPostsList.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 py-8 px-4 text-center dark:border-zinc-800 dark:bg-zinc-950/30">
                <PenTool className="h-8 w-8 mx-auto text-zinc-300 dark:text-zinc-600 mb-2" />
                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">No saved drafts yet</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">Start drafting a post anytime and save it for later.</p>
                <button
                  onClick={() => {
                    setEditingPost(null);
                    setCurrentView('create-post');
                  }}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-purple-800 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create Draft</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {draftPostsList.slice(0, 4).map((draft) => (
                  <div
                    key={draft.id}
                    className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-zinc-50/70 p-3.5 hover:border-purple-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:hover:border-purple-800 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      {draft.media_urls?.[0] ? (
                        <img 
                          src={draft.media_urls[0]} 
                          alt="Draft preview" 
                          referrerPolicy="no-referrer"
                          className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 flex-shrink-0">
                          <PenTool className="h-5 w-5" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                          {draft.title || 'Untitled Draft'}
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">
                          Last edited {new Date(draft.updated_at).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-1 mt-1.5">
                          {draft.platforms.map(p => (
                            <span key={p} className="text-[9px] font-bold uppercase rounded bg-zinc-200 px-1 py-0.2 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-end">
                      <button
                        id={`btn-resume-draft-${draft.id}`}
                        onClick={() => handleResumeDraft(draft)}
                        className="flex items-center gap-1 rounded-lg bg-purple-800 px-3 py-1 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition-all active:scale-98 cursor-pointer"
                      >
                        <span>Resume</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scheduled Posts (Figure 5.5) */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/70">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Scheduled Posts</h3>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  {scheduledPostsCount} Pending
                </span>
              </div>
              <button
                onClick={() => setCurrentView('scheduler')}
                className="text-xs font-semibold text-purple-700 dark:text-purple-400 hover:underline cursor-pointer"
              >
                Calendar View →
              </button>
            </div>

            {scheduledPostsList.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 py-8 px-4 text-center dark:border-zinc-800 dark:bg-zinc-950/30">
                <Calendar className="h-8 w-8 mx-auto text-zinc-300 dark:text-zinc-600 mb-2" />
                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">No posts scheduled yet.</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">Schedule upcoming content to publish automatically.</p>
                <button
                  onClick={() => setCurrentView('scheduler')}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 transition-colors"
                >
                  <Calendar className="h-3.5 w-3.5 text-amber-500" />
                  <span>Open Scheduler</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {scheduledPostsList.slice(0, 4).map((post) => (
                  <div key={post.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {post.media_urls?.[0] ? (
                        <img 
                          src={post.media_urls[0]} 
                          alt="Thumbnail" 
                          referrerPolicy="no-referrer"
                          className="h-11 w-11 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex-shrink-0">
                          <Calendar className="h-5 w-5" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                          {post.title}
                        </p>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                          Scheduled: {post.scheduled_for ? new Date(post.scheduled_for).toLocaleString() : 'Upcoming'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        Queued
                      </span>
                      <button
                        onClick={() => handleResumeDraft(post)}
                        className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                        title="Edit post"
                      >
                        <FileEdit className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Performance & Reach Velocity */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/70">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Engagement & Reach</h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Weekly velocity across connected channels</p>
              </div>
              <button
                onClick={() => setCurrentView('analytics')}
                className="text-xs font-semibold text-purple-700 dark:text-purple-400 hover:underline cursor-pointer"
              >
                Full Analytics →
              </button>
            </div>

            {posts.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-center p-4 bg-zinc-50/50 dark:bg-zinc-950/20 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                <BarChart3 className="h-8 w-8 text-zinc-300 dark:text-zinc-700 mb-2" />
                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">No analytics data yet</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs">
                  Create and publish posts to begin tracking real-time audience reach and engagement metrics.
                </p>
              </div>
            ) : (
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={engagementTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                    <XAxis dataKey="day" stroke="#a1a1aa" fontSize={11} tickLine={false} />
                    <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} 
                    />
                    <Area type="monotone" dataKey="reach" stroke="#7C3AED" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReach)" name="Total Reach" />
                    <Area type="monotone" dataKey="likes" stroke="#06B6D4" strokeWidth={2} fillOpacity={0} name="Likes" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Channels & Post History (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Channels / Social Accounts (Figures 5.5 & 5.6) */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/70">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Channels</h3>
              </div>
              <button
                id="btn-dash-manage-channels"
                onClick={() => setCurrentView('integrations')}
                className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider hover:underline cursor-pointer"
              >
                MANAGE
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { platform: 'instagram', label: 'Instagram', color: 'from-pink-500 to-rose-500' },
                { platform: 'linkedin', label: 'LinkedIn', color: 'from-blue-600 to-indigo-700' },
                { platform: 'facebook', label: 'Facebook', color: 'from-blue-500 to-blue-700' },
                { platform: 'twitter', label: 'Twitter / X', color: 'from-zinc-700 to-zinc-900' },
                { platform: 'tiktok', label: 'TikTok', color: 'from-zinc-900 to-black' },
                { platform: 'youtube', label: 'YouTube', color: 'from-red-600 to-rose-700' },
              ].map(item => {
                const acc = socialAccounts.find(s => s.platform === item.platform);
                const isConnected = acc?.connected || false;

                return (
                  <div
                    key={item.platform}
                    onClick={() => setCurrentView('integrations')}
                    className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 hover:border-purple-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:hover:border-purple-800 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900 dark:text-white">{item.label}</span>
                      <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[10px]">
                      <span className={isConnected ? 'font-semibold text-emerald-600 dark:text-emerald-400' : 'text-zinc-400'}>
                        {isConnected ? 'Connected' : 'Not Connected'}
                      </span>
                      <span className="text-purple-600 dark:text-purple-400 font-semibold">
                        {isConnected ? 'Active' : 'Connect'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Post History (Figure 5.6) */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/70">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Post History</h3>
              </div>
              <button
                id="btn-dash-view-all-posts"
                onClick={() => setCurrentView('post-history')}
                className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider hover:underline cursor-pointer"
              >
                VIEW ALL
              </button>
            </div>

            {posts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 py-8 px-4 text-center dark:border-zinc-800 dark:bg-zinc-950/30">
                <Layers className="h-8 w-8 mx-auto text-zinc-300 dark:text-zinc-600 mb-2" />
                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">No posts yet</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">Your created posts will appear here.</p>
                <button
                  onClick={() => {
                    setEditingPost(null);
                    setCurrentView('create-post');
                  }}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-purple-800 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create First Post</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {posts.slice(0, 5).map((post) => (
                  <div key={post.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {post.media_urls?.[0] ? (
                        <img 
                          src={post.media_urls[0]} 
                          alt={post.title} 
                          referrerPolicy="no-referrer"
                          className="h-10 w-10 rounded-lg object-cover flex-shrink-0" 
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 flex-shrink-0">
                          <PenTool className="h-4 w-4" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                          {post.title || 'Untitled Post'}
                        </p>
                        <p className="text-[10px] text-zinc-400">
                          {new Date(post.created_at).toLocaleDateString()} • {post.platforms.join(', ')}
                        </p>
                      </div>
                    </div>

                    <div>
                      <span className={`rounded-md px-2 py-0.5 text-[9px] font-bold uppercase ${
                        post.status === 'published' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : post.status === 'scheduled'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
