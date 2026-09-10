import React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  PenTool, 
  Hash, 
  Image as ImageIcon, 
  Video, 
  TrendingUp, 
  Calendar, 
  Layers, 
  Share2, 
  BarChart3, 
  FileText, 
  Palette, 
  Settings, 
  UploadCloud, 
  Sparkles,
  Plus,
  Radio,
  BookOpen
} from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { currentView, setCurrentView, posts } = useApp();

  const scheduledCount = posts.filter(p => p.status === 'scheduled' || p.status === 'queued').length;
  const draftCount = posts.filter(p => p.status === 'draft').length;

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    onCloseMobile();
  };

  const navSections = [
    {
      title: 'CORE',
      items: [
        { id: 'dashboard' as AppView, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'create-post' as AppView, label: 'Create Post', icon: PenTool },
        { id: 'manual-upload' as AppView, label: 'Manual Upload', icon: UploadCloud },
      ]
    },
    {
      title: 'AI AGENTS',
      items: [
        { id: 'agents' as AppView, label: 'AI Agents Hub', icon: Bot },
        { id: 'content-agent' as AppView, label: 'Content Generator', icon: Sparkles },
        { id: 'quick-generator' as AppView, label: 'Captions & Hashtags', icon: Hash },
        { id: 'image-agent' as AppView, label: 'Image Generator', icon: ImageIcon },
        { id: 'video-agent' as AppView, label: 'Video Generator', icon: Video },
        { id: 'competitor-analysis' as AppView, label: 'Competitor Analysis', icon: TrendingUp },
        { id: 'scheduler' as AppView, label: 'Scheduling', icon: Calendar, badge: scheduledCount > 0 ? `${scheduledCount}` : undefined },
        { id: 'analytics' as AppView, label: 'Analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'CONTENT',
      items: [
        { id: 'post-history' as AppView, label: 'Post History', icon: Layers, badge: draftCount > 0 ? `${draftCount} drafts` : undefined },
        { id: 'templates' as AppView, label: 'Templates', icon: BookOpen },
        { id: 'integrations' as AppView, label: 'Social Accounts', icon: Share2 },
        { id: 'reports' as AppView, label: 'Reports', icon: FileText },
      ]
    },
    {
      title: 'SETTINGS',
      items: [
        { id: 'brand-settings' as AppView, label: 'Profile & Branding', icon: Palette },
        { id: 'settings' as AppView, label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 z-40 bg-zinc-900/60 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200 bg-zinc-50/95 transition-transform duration-200 ease-in-out dark:border-zinc-800 dark:bg-zinc-950/95 md:static md:translate-x-0 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Top Header Logo on mobile */}
        <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800 md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-800 text-white">
              <Bot className="h-4 w-4" />
            </div>
            <span className="font-bold text-zinc-900 dark:text-white">ViroAI</span>
          </div>
          <button 
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>

        {/* Action Button */}
        <div className="p-3">
          <button
            id="btn-sidebar-create-post"
            onClick={() => navigateTo('create-post')}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-800 px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-purple-950/20 hover:bg-purple-700 transition-all active:scale-98"
          >
            <Plus className="h-4 w-4" />
            <span>Create AI Post</span>
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-3 py-2 space-y-5">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <p className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-item-${item.id}`}
                      onClick={() => navigateTo(item.id)}
                      className={`
                        group flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-all
                        ${isActive 
                          ? 'bg-purple-800 text-white shadow-xs' 
                          : 'text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-100'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${isActive ? 'bg-purple-700 text-purple-100' : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Platform Status Footer */}
        <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
          <div className="rounded-xl border border-zinc-200 bg-white p-2.5 dark:border-zinc-800/80 dark:bg-zinc-900/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">ViroAI Platform</span>
              </div>
              <span className="text-[10px] text-zinc-400">Ready</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
