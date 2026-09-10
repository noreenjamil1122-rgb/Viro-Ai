import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Layers, 
  Share2, 
  Eye, 
  Trash2,
  CalendarCheck,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Post, SocialPlatform } from '../types';

export const SchedulingCalendarView: React.FC = () => {
  const { posts, setCurrentView, setEditingPost, deletePost, addNotification } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [selectedPostDetail, setSelectedPostDetail] = useState<Post | null>(null);

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  // Filter posts
  const filteredPosts = posts.filter(p => {
    if (platformFilter !== 'all' && !p.platforms.includes(platformFilter as SocialPlatform)) {
      return false;
    }
    return true;
  });

  const getPostsForDay = (dayNumber: number) => {
    return filteredPosts.filter(p => {
      if (!p.scheduled_for && !p.published_at) return false;
      const d = new Date(p.scheduled_for || p.published_at!);
      return d.getFullYear() === currentDate.getFullYear() &&
             d.getMonth() === currentDate.getMonth() &&
             d.getDate() === dayNumber;
    });
  };

  const scheduledCount = posts.filter(p => p.status === 'scheduled' || p.status === 'queued').length;
  const publishedCount = posts.filter(p => p.status === 'published').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                Scheduling Module
              </span>
              <span className="text-xs text-zinc-400">• Calendar & Queue</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
              Scheduling
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Visualize scheduled posts, manage publishing queues, and organize your social calendar.
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

      {/* Calendar Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-xl border border-zinc-200 p-1 dark:border-zinc-800">
            <button
              onClick={prevMonth}
              className="rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-xs font-bold text-zinc-900 dark:text-white min-w-[120px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button
              onClick={nextMonth}
              className="rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>{scheduledCount} Scheduled</span>
            <span className="mx-1">•</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>{publishedCount} Published</span>
          </div>
        </div>

        {/* View mode toggle & Platform Filter */}
        <div className="flex items-center gap-2">
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

          <div className="flex rounded-xl border border-zinc-200 p-1 dark:border-zinc-800">
            <button
              onClick={() => setViewMode('month')}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                viewMode === 'month' ? 'bg-purple-800 text-white' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                viewMode === 'list' ? 'bg-purple-800 text-white' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              Queue List
            </button>
          </div>
        </div>
      </div>

      {/* Month View Grid */}
      {viewMode === 'month' && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 overflow-x-auto">
          <div className="min-w-[650px]">
            {/* Days header */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar Cells */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty padding days */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[100px] rounded-xl border border-zinc-100 bg-zinc-50/30 p-2 dark:border-zinc-800/40 dark:bg-zinc-950/20" />
              ))}

              {/* Days of month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dayPosts = getPostsForDay(dayNum);
                const isToday = new Date().getDate() === dayNum && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();

                return (
                  <div
                    key={`day-${dayNum}`}
                    className={`min-h-[100px] rounded-xl border p-2 flex flex-col justify-between transition-all ${
                      isToday
                        ? 'border-purple-700/80 bg-purple-50/20 dark:bg-purple-950/20'
                        : 'border-zinc-200 bg-white hover:bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-950/60 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isToday ? 'text-purple-700 dark:text-purple-300 dark:text-purple-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                        {dayNum}
                      </span>
                      {dayPosts.length > 0 && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-200 text-[9px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                          {dayPosts.length}
                        </span>
                      )}
                    </div>

                    {/* Post items in cell */}
                    <div className="space-y-1 my-1">
                      {dayPosts.slice(0, 2).map((post) => (
                        <div
                          key={post.id}
                          onClick={() => setSelectedPostDetail(post)}
                          className={`cursor-pointer rounded-lg px-1.5 py-1 text-[10px] font-medium truncate flex items-center gap-1 ${
                            post.status === 'scheduled' || post.status === 'queued'
                              ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current flex-shrink-0" />
                          <span className="truncate">{post.title}</span>
                        </div>
                      ))}
                      {dayPosts.length > 2 && (
                        <span className="text-[9px] text-zinc-400 block font-medium">
                          +{dayPosts.length - 2} more
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <button
                        onClick={() => {
                          const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum, 10, 0);
                          setCurrentView('create-post');
                        }}
                        className="text-[9px] text-zinc-400 hover:text-purple-700 dark:text-purple-300 dark:hover:text-purple-400 font-semibold"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Queue List View */}
      {viewMode === 'list' && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-3">
            Active Scheduling Queue
          </h3>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredPosts
              .filter(p => p.status === 'scheduled' || p.status === 'queued')
              .map((post) => (
                <div key={post.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {post.media_urls?.[0] && (
                      <img 
                        src={post.media_urls[0]} 
                        alt="Post thumbnail" 
                        referrerPolicy="no-referrer"
                        className="h-12 w-12 rounded-lg object-cover flex-shrink-0" 
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{post.title}</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">{post.caption}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="rounded bg-amber-50 px-1.5 py-0.2 text-[10px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                          {post.scheduled_for ? new Date(post.scheduled_for).toLocaleString() : 'Queued'}
                        </span>
                        <span className="text-[10px] text-zinc-400 capitalize">{post.platforms.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => { setEditingPost(post); setCurrentView('create-post'); }}
                      className="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      Reschedule / Edit
                    </button>
                    <button
                      onClick={() => { deletePost(post.id); addNotification('Deleted', 'Removed from schedule', 'info'); }}
                      className="rounded-lg p-1.5 text-zinc-400 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Post Detail Inspection Modal */}
      {selectedPostDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                  selectedPostDetail.status === 'published' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {selectedPostDetail.status}
                </span>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white mt-1">{selectedPostDetail.title}</h3>
              </div>
              <button onClick={() => setSelectedPostDetail(null)} className="text-zinc-400 hover:text-zinc-600">✕</button>
            </div>

            {selectedPostDetail.media_urls?.[0] && (
              <div className="aspect-video overflow-hidden rounded-xl bg-zinc-950 mb-3">
                <img 
                  src={selectedPostDetail.media_urls[0]} 
                  alt="Post" 
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover" 
                />
              </div>
            )}

            <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-line max-h-40 overflow-y-auto mb-4">
              {selectedPostDetail.caption}
            </div>

            <div className="flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
              <span className="text-[11px] text-zinc-500">
                {selectedPostDetail.scheduled_for ? `Scheduled: ${new Date(selectedPostDetail.scheduled_for).toLocaleString()}` : `Published`}
              </span>
              <button
                onClick={() => {
                  setEditingPost(selectedPostDetail);
                  setSelectedPostDetail(null);
                  setCurrentView('create-post');
                }}
                className="rounded-xl bg-purple-800 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-purple-700"
              >
                Edit Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
