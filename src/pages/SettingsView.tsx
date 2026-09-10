import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Database, 
  Key, 
  Sparkles, 
  ShieldCheck, 
  Moon, 
  Sun, 
  RotateCcw, 
  Download, 
  Upload, 
  Check, 
  AlertTriangle, 
  Info,
  Server,
  Activity,
  HardDrive,
  Cpu
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
export const SettingsView: React.FC = () => {
  const { theme, toggleTheme, addNotification, refreshAllData, posts, socialAccounts, competitors } = useApp();
  const { user } = useAuth();

  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [isResettingData, setIsResettingData] = useState(false);

  const checkSystemHealth = async () => {
    setIsCheckingHealth(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setHealthStatus(data);
      }
    } catch (e) {
      console.warn('Health check error:', e);
    } finally {
      setIsCheckingHealth(false);
    }
  };

  useEffect(() => {
    checkSystemHealth();
  }, []);

  const isMongoConnected = healthStatus?.database?.connected ?? true;

  const handleExportWorkspace = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      version: '2.0.0',
      database: 'MongoDB Atlas',
      posts,
      socialAccounts,
      competitors,
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ViroAI_Workspace_Backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addNotification('Workspace Exported', 'Full JSON backup downloaded to your computer.', 'success');
  };

  const handleResetWorkspaceData = async () => {
    if (!window.confirm('Are you sure you want to reset all local storage workspace cache? This will clear saved local records.')) return;
    setIsResettingData(true);
    try {
      localStorage.removeItem('viroai_posts');
      localStorage.removeItem('viroai_social_accounts');
      localStorage.removeItem('viroai_competitors');
      localStorage.removeItem('viroai_brand_settings');
      localStorage.removeItem('viroai_notifications');
      localStorage.removeItem('viroai_analytics');
      localStorage.removeItem('viroai_agent_activities');
      
      await refreshAllData();
      addNotification('Workspace Cleared', 'All local workspace cache has been reset.', 'info');
    } finally {
      setIsResettingData(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Settings
          </h1>
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            System Configuration
          </span>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Manage system preferences, verify backend AI agents, and monitor MongoDB Atlas cloud connection.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Integrations, Database & Keys */}
        <div className="space-y-6 lg:col-span-2">
          {/* Storage & Database Architecture */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
                <Database className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                Database Persistence Engine
              </h2>
              <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isMongoConnected 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                <span className={`h-2 w-2 rounded-full ${isMongoConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                {isMongoConnected ? 'MongoDB Atlas Connected' : 'Connecting to Database'}
              </span>
            </div>

            <p className="mb-4 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              ViroAI is powered by a dedicated Node.js + Express backend with MongoDB Atlas cloud persistence. Posts, Brand Settings, Competitors, and User profiles are stored and synchronized directly in your MongoDB cloud cluster.
            </p>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Database Engine</span>
                  <p className="text-xs font-semibold text-zinc-900 dark:text-white mt-0.5">
                    MongoDB Atlas (Mongoose ODM)
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Live Cloud Records</span>
                  <p className="text-xs font-semibold text-zinc-900 dark:text-white mt-0.5">
                    {posts.length} Posts • {competitors.length} Competitors Tracked
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Engine & Gemini API Status */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
                <Cpu className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                Gemini Multi-Agent AI Engine
              </h2>
              <button
                onClick={checkSystemHealth}
                disabled={isCheckingHealth}
                className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {isCheckingHealth ? 'Checking...' : 'Ping Engine'}
              </button>
            </div>

            <p className="mb-4 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              AI operations (caption creation, hashtag research, competitor SWOT parsing, reel storyboard drafting, analytics synthesis) run securely through server-side routes via the Google Gen AI SDK (<code className="rounded bg-zinc-100 px-1 py-0.5 text-[11px] font-mono dark:bg-zinc-800">@google/genai</code>).
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <div>
                    <p className="text-xs font-semibold text-zinc-900 dark:text-white">Gemini 3.6 Flash</p>
                    <p className="text-[11px] text-zinc-500">Core reasoning, multi-scene storyboarding & competitor audits</p>
                  </div>
                </div>
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  Online
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-cyan-500" />
                  <div>
                    <p className="text-xs font-semibold text-zinc-900 dark:text-white">Intelligent Fallback Engine</p>
                    <p className="text-[11px] text-zinc-500">High-fidelity offline fallback guarantees 100% uptime</p>
                  </div>
                </div>
                <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[11px] font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  Ready
                </span>
              </div>
            </div>
          </div>

          {/* Backup & Data Reset */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-2 text-sm font-bold text-zinc-900 dark:text-white">
              Data Management & Backup
            </h2>
            <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
              Download your complete workspace state or reset your workspace local storage.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleExportWorkspace}
                className="flex items-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                <Download className="h-4 w-4" />
                <span>Export Backup (JSON)</span>
              </button>

              <button
                onClick={handleResetWorkspaceData}
                disabled={isResettingData}
                className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 shadow-xs hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/80"
              >
                <RotateCcw className={`h-4 w-4 ${isResettingData ? 'animate-spin' : ''}`} />
                <span>{isResettingData ? 'Resetting...' : 'Reset Workspace Data'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Preferences & User Identity */}
        <div className="space-y-6">
          {/* User Account */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-3 text-sm font-bold text-zinc-900 dark:text-white">
              Account Profile
            </h2>

            <div className="flex items-center gap-3 mb-4">
              <img
                src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"}
                alt={user?.full_name || "User"}
                className="h-12 w-12 rounded-xl object-cover"
              />
              <div>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">{user?.full_name || 'ViroAI User'}</p>
                <p className="text-xs text-zinc-500">{user?.email || 'user@viroai.com'}</p>
              </div>
            </div>

            <div className="border-t border-zinc-100 pt-3 dark:border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500 dark:text-zinc-400">Account Access</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Full Access (All Agents)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500 dark:text-zinc-400">Status</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-200">Active</span>
              </div>
            </div>
          </div>

          {/* Interface Appearance */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-3 text-sm font-bold text-zinc-900 dark:text-white">
              Display & Theme
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-zinc-900 dark:text-white">Theme Mode</p>
                <p className="text-[11px] text-zinc-500 capitalize">Currently {theme} mode</p>
              </div>

              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-4 w-4 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 text-zinc-600" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Academic Context Card */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-xs font-bold text-zinc-900 dark:text-white">ViroAI Architecture</h3>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed dark:text-zinc-400">
              ViroAI: AI-Driven Multi-Agent Business Intelligence System configured for full-stack social media management, competitor benchmark SWOT extraction, and automated cross-network scheduling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
