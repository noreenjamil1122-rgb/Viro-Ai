import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Bell, 
  Moon, 
  Sun, 
  User, 
  LogOut, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  X, 
  PlusCircle, 
  Menu,
  Database,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';


interface NavbarProps {
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileSidebar }) => {
  const { 
    currentView, 
    setCurrentView, 
    notifications, 
    unreadNotificationsCount, 
    markNotificationRead, 
    markAllNotificationsRead,
    theme, 
    toggleTheme,
    brandSettings
  } = useApp();

  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white/90 px-4 backdrop-blur-md transition-colors dark:border-zinc-800 dark:bg-zinc-950/90 sm:px-6">
      {/* Left section: Mobile menu + Brand title */}
      <div className="flex items-center gap-3">
        <button
          id="btn-mobile-sidebar-toggle"
          onClick={onToggleMobileSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 md:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div 
          className="flex cursor-pointer items-center gap-2.5"
          onClick={() => setCurrentView('dashboard')}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-800 text-white shadow-sm shadow-purple-500/30">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-zinc-900 dark:text-white">ViroAI</span>
            </div>
            <p className="hidden text-[11px] font-medium text-zinc-500 dark:text-zinc-400 lg:block">
              AI Business Intelligence Platform
            </p>
          </div>
        </div>
      </div>

      {/* Center/Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Create Post button */}
        <button
          id="btn-navbar-quick-create"
          onClick={() => setCurrentView('create-post')}
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-purple-800 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-purple-700 transition-colors"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Create Post</span>
        </button>

        {/* Database Status Indicator */}
        <div 
          className="hidden md:flex items-center gap-1.5 rounded-full border border-zinc-200 px-2.5 py-1 text-[11px] font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-400 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900"
          onClick={() => setCurrentView('settings')}
          title="Connected to MongoDB Atlas Cloud & Node.js Backend"
        >
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>MongoDB Atlas Connected</span>
        </div>

        {/* Theme Toggle */}
        <button
          id="btn-theme-toggle"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 transition-colors"
          aria-label="Toggle dark/light theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-zinc-700" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            id="btn-notifications-toggle"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-zinc-200 bg-white p-3 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 z-50">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5 dark:border-zinc-800">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">Notifications</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="rounded-full bg-purple-100 px-1.5 py-0.2 text-[10px] font-semibold text-purple-700 dark:text-purple-300 dark:bg-purple-950 dark:text-purple-400">
                      {unreadNotificationsCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-zinc-500 hover:text-purple-700 dark:text-purple-300 dark:text-zinc-400 dark:hover:text-purple-400"
                  >
                    Mark all read
                  </button>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-72 divide-y divide-zinc-100 overflow-y-auto dark:divide-zinc-800/60">
                {notifications.length === 0 ? (
                  <p className="py-6 text-center text-xs text-zinc-400">No notifications at the moment</p>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.link) setCurrentView(n.link as any);
                        setShowNotifications(false);
                      }}
                      className={`flex cursor-pointer items-start gap-2.5 py-2.5 px-1 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${!n.read ? 'bg-purple-50/40 dark:bg-purple-950/20' : ''}`}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {n.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                        {n.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                        {n.type === 'error' && <AlertTriangle className="h-4 w-4 text-rose-500" />}
                        {n.type === 'info' && <Info className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs ${!n.read ? 'font-bold text-zinc-900 dark:text-white' : 'font-medium text-zinc-700 dark:text-zinc-300'}`}>
                          {n.title}
                        </p>
                        <p className="text-[11px] text-zinc-500 line-clamp-2 dark:text-zinc-400">
                          {n.message}
                        </p>
                        <span className="text-[10px] text-zinc-400">
                          {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            id="btn-user-profile-menu"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 p-1.5 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900 transition-colors"
          >
            <img 
              src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"} 
              alt={user?.full_name || 'User Avatar'} 
              className="h-7 w-7 rounded-md object-cover"
            />
            <div className="hidden text-left md:block pr-1">
              <p className="text-xs font-semibold text-zinc-900 dark:text-white leading-tight">
                {user?.full_name || (user?.email ? user.email.split('@')[0] : 'User')}
              </p>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate max-w-[120px]">
                {user?.email || 'user@viroai.com'}
              </p>
            </div>
            <ChevronDown className="h-3 w-3 text-zinc-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-60 rounded-xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 z-50">
              <div className="border-b border-zinc-100 p-2 dark:border-zinc-800">
                <p className="text-xs font-bold text-zinc-900 dark:text-white">{user?.full_name}</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => { setCurrentView('brand-settings'); setShowUserMenu(false); }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span>Brand Identity</span>
                </button>
                <button
                  onClick={() => { setCurrentView('settings'); setShowUserMenu(false); }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <User className="h-4 w-4 text-zinc-500" />
                  <span>Account & Settings</span>
                </button>
              </div>

              <div className="border-t border-zinc-100 pt-1 dark:border-zinc-800">
                <button
                  id="btn-logout"
                  onClick={() => { logout(); setCurrentView('landing'); setShowUserMenu(false); }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
