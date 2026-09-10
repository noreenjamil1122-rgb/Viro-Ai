import React, { useState } from 'react';
import { 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  Key, 
  ShieldCheck, 
  Lock,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SocialPlatform } from '../types';

export const SocialIntegrationsView: React.FC = () => {
  const { socialAccounts, brandSettings, toggleSocialConnection, addNotification } = useApp();

  const [connectingPlatform, setConnectingPlatform] = useState<SocialPlatform | null>(null);

  const platformMeta: Record<SocialPlatform, { name: string; color: string; desc: string; iconLetter: string }> = {
    instagram: {
      name: 'Instagram Business',
      color: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white',
      desc: 'Publish feed posts, carousels, and reels. Access engagement metrics.',
      iconLetter: 'IG',
    },
    linkedin: {
      name: 'LinkedIn Company Page',
      color: 'bg-blue-600 text-white',
      desc: 'Publish B2B thought leadership articles, images, and company updates.',
      iconLetter: 'IN',
    },
    twitter: {
      name: 'X (Twitter)',
      color: 'bg-zinc-900 text-white dark:bg-zinc-800',
      desc: 'Broadcast real-time announcements, threads, and media tweets.',
      iconLetter: 'X',
    },
    facebook: {
      name: 'Facebook Page',
      color: 'bg-blue-700 text-white',
      desc: 'Manage brand community updates, live posts, and video shares.',
      iconLetter: 'FB',
    },
    tiktok: {
      name: 'TikTok Creator',
      color: 'bg-black text-white',
      desc: 'Upload vertical short-form reels and monitor viral engagement.',
      iconLetter: 'TT',
    },
    youtube: {
      name: 'YouTube Shorts & Channel',
      color: 'bg-red-600 text-white',
      desc: 'Schedule video shorts and long-form video spotlights.',
      iconLetter: 'YT',
    }
  };

  const handleToggle = async (platform: SocialPlatform, currentConnected: boolean) => {
    setConnectingPlatform(platform);
    
    setTimeout(async () => {
      const brand = brandSettings.brand_name || 'Brand';
      const handleName = brand.toLowerCase().replace(/[^a-z0-9]/g, '');
      await toggleSocialConnection(platform, !currentConnected, `${brand} Official`, `@${handleName}_${platform}`);
      setConnectingPlatform(null);
      addNotification(
        currentConnected ? 'Channel Disconnected' : 'Channel Connected',
        `${platformMeta[platform].name} has been ${currentConnected ? 'disconnected' : 'authorized and connected'}.`,
        currentConnected ? 'info' : 'success'
      );
    }, 700);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:text-purple-300 dark:bg-purple-950 dark:text-purple-400">
                Integrations Module
              </span>
              <span className="text-xs text-zinc-400">• Social API Channels</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
              Social Integrations
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Connect social media accounts to enable automated multi-platform dispatching and analytics aggregation.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/20 p-2.5 dark:bg-emerald-950/20 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              API Connection Ready
            </span>
          </div>
        </div>
      </div>

      {/* Social Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {socialAccounts.map((account) => {
          const meta = platformMeta[account.platform];
          const isPending = connectingPlatform === account.platform;

          return (
            <div
              key={account.id}
              className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs transition-all dark:border-zinc-800 dark:bg-zinc-900/60"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl font-bold text-sm shadow-xs ${meta.color}`}>
                    {meta.iconLetter}
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    account.connected 
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                      : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}>
                    {account.connected ? '● Connected' : '○ Not Linked'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{meta.name}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  {meta.desc}
                </p>

                {account.connected ? (
                  <div className="mt-4 rounded-xl border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800/80 dark:bg-zinc-950/40 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-zinc-400 font-medium">Handle:</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">{account.account_handle}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 font-medium">Audience:</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">
                        {account.followers_count ? account.followers_count.toLocaleString() : '0'} followers
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border border-dashed border-zinc-200 p-3 text-center text-xs text-zinc-400 dark:border-zinc-800">
                    No active account linked
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => handleToggle(account.platform, account.connected)}
                  disabled={isPending}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all ${
                    account.connected
                      ? 'border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
                      : 'bg-purple-800 text-white shadow-xs hover:bg-purple-700'
                  }`}
                >
                  {isPending ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Syncing API Token...</span>
                    </>
                  ) : account.connected ? (
                    <span>Disconnect Channel</span>
                  ) : (
                    <span>Connect & Authorize</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
