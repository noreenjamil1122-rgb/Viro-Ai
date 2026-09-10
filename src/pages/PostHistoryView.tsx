import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  PenTool, 
  Calendar, 
  CheckCircle2, 
  Trash2, 
  Copy, 
  Eye, 
  Plus, 
  Sparkles, 
  UploadCloud,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Post, SocialPlatform, PostStatus } from '../types';

export const PostHistoryView: React.FC = () => {
  const { posts, setCurrentView, setEditingPost, deletePost, createPost, addNotification } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'scheduled' | 'published'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');

  const filteredPosts = posts.filter((p) => {
    if (activeTab !== 'all' && p.status !== activeTab) return false;
    if (platformFilter !== 'all' && !p.platforms.includes(platformFilter as SocialPlatform)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.caption.toLowerCase().includes(q);
    }
    return true;
  });

  const handleDuplicate = async (post: Post) => {
    await createPost({
      title: `${post.title} (Copy)`,
      caption: post.caption,
      platforms: post.platforms,
      media_urls: post.media_urls,
      hashtags: post.hashtags,
      status: 'draft',
      ai_generated: post.ai_generated,
    });
    addNotification('Post Duplicated', `Created a new draft copy of "${post.title}".`, 'success');
  };

  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case 'published':
        return <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">Published</span>;
      case 'scheduled':
      case 'queued':
        return <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">Scheduled</span>;
      case 'draft':
        return <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">Draft</span>;
      default:
        return <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:text-purple-300 dark:bg-purple-950 dark:text-purple-400">
                Content Archive
              </span>
              <span className="text-xs text-zinc-400">• {posts.length} Posts</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
              Post History
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Browse, filter, edit, and manage all your drafts, scheduled releases, and published content.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('create-post')}
              className="flex items-center gap-1.5 rounded-xl bg-purple-800 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition-all active:scale-98"
            >
              <Plus className="h-4 w-4" />
              <span>Create Post</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'draft', 'scheduled', 'published'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-purple-800 text-white shadow-xs'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`}
            >
              {tab === 'all' ? 'All Content' : tab} ({posts.filter(p => tab === 'all' ? true : p.status === tab).length})
            </button>
          ))}
        </div>

        {/* Search Input & Platform Selector */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-1.5 pl-8 pr-3 text-xs text-zinc-900 focus:border-purple-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            />
          </div>

          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
          >
            <option value="all">All Channels</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">X / Twitter</option>
            <option value="facebook">Facebook</option>
          </select>
        </div>
      </div>

      {/* Posts Grid / List */}
      {filteredPosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/20">
          <Layers className="h-10 w-10 mx-auto text-zinc-400 mb-2" />
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No Posts Found</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search filters or create a new social media post using the AI Studio.
          </p>
          <button
            onClick={() => setCurrentView('create-post')}
            className="mt-4 rounded-xl bg-purple-800 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700"
          >
            + Create New Post
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/60"
            >
              <div>
                {/* Media thumbnail */}
                {post.media_urls?.[0] ? (
                  <div className="aspect-video overflow-hidden rounded-xl bg-zinc-950 mb-3 border border-zinc-100 dark:border-zinc-800">
                    <img 
                      src={post.media_urls[0]} 
                      alt={post.title} 
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover" 
                    />
                  </div>
                ) : (
                  <div className="aspect-video flex items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 mb-3 dark:bg-zinc-800/60">
                    <PenTool className="h-6 w-6" />
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 mb-1.5">
                  {getStatusBadge(post.status)}
                  {post.ai_generated && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-purple-700 dark:text-purple-300 dark:text-purple-400">
                      <Sparkles className="h-3 w-3" /> AI Generated
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                  {post.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 mt-1 leading-relaxed">
                  {post.caption}
                </p>

                {/* Platforms & Hashtags */}
                <div className="mt-3 flex flex-wrap items-center gap-1">
                  {post.platforms.map((pl) => (
                    <span key={pl} className="rounded bg-zinc-100 px-1.5 py-0.5 text-[9px] font-bold capitalize text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {pl === 'twitter' ? 'X' : pl}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-[10px] text-zinc-400">
                  {post.scheduled_for
                    ? `Sched: ${new Date(post.scheduled_for).toLocaleDateString()}`
                    : post.published_at
                    ? `Pub: ${new Date(post.published_at).toLocaleDateString()}`
                    : `Created: ${new Date(post.created_at).toLocaleDateString()}`}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDuplicate(post)}
                    title="Duplicate Post"
                    className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-white"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => { setEditingPost(post); setCurrentView('create-post'); }}
                    title="Edit Post"
                    className="rounded-lg p-1.5 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950/40"
                  >
                    <PenTool className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => { deletePost(post.id); addNotification('Deleted', `Deleted "${post.title}"`, 'info'); }}
                    title="Delete Post"
                    className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
