import React from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Image as ImageIcon } from 'lucide-react';
import { BrandSettings } from '../../types';

interface InstagramPreviewProps {
  caption: string;
  hashtags: string[];
  callToAction?: string;
  mediaUrl?: string;
  brandSettings?: BrandSettings;
  authorName?: string;
  authorAvatar?: string;
}

export const InstagramPreview: React.FC<InstagramPreviewProps> = ({
  caption,
  hashtags,
  callToAction,
  mediaUrl,
  brandSettings,
  authorName,
  authorAvatar,
}) => {
  const username = brandSettings?.brand_name 
    ? brandSettings.brand_name.toLowerCase().replace(/\s+/g, '_')
    : (authorName ? authorName.toLowerCase().replace(/\s+/g, '_') : 'viroai_studio');

  const avatar = brandSettings?.logo_url || authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80";

  return (
    <div id="preview-instagram-card" className="w-full max-w-sm mx-auto overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-900">
      {/* Top Profile Bar */}
      <div className="flex items-center justify-between p-3 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[1.5px] shrink-0">
            <img 
              src={avatar} 
              alt={username} 
              referrerPolicy="no-referrer"
              className="h-full w-full rounded-full object-cover border border-white dark:border-zinc-900"
            />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-zinc-900 dark:text-white text-xs truncate">
              {username}
            </p>
            <p className="text-[10px] text-zinc-400">Sponsored • Instagram Feed</p>
          </div>
        </div>
        <button type="button" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Media Frame */}
      <div className="aspect-square bg-zinc-100 dark:bg-zinc-950 relative overflow-hidden flex items-center justify-center border-b border-zinc-100 dark:border-zinc-800/60">
        {mediaUrl ? (
          <img 
            src={mediaUrl} 
            alt="Instagram post visual" 
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover" 
          />
        ) : (
          <div className="text-center p-6 text-zinc-400 dark:text-zinc-600">
            <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50 stroke-[1.5]" />
            <p className="text-xs font-semibold">Media preview</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">1:1 Square recommended</p>
          </div>
        )}

        {callToAction && (
          <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-xs py-1.5 px-3 rounded-lg flex items-center justify-between text-white text-[11px]">
            <span className="font-semibold truncate">{callToAction}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 shrink-0 ml-2">Shop Now ›</span>
          </div>
        )}
      </div>

      {/* Engagement Actions */}
      <div className="p-3.5 space-y-2.5">
        <div className="flex items-center justify-between text-zinc-800 dark:text-zinc-200">
          <div className="flex items-center gap-3.5">
            <Heart className="h-5 w-5 hover:text-rose-500 cursor-pointer transition-colors" />
            <MessageCircle className="h-5 w-5 hover:text-blue-500 cursor-pointer transition-colors" />
            <Send className="h-5 w-5 hover:text-purple-500 cursor-pointer transition-colors" />
          </div>
          <Bookmark className="h-5 w-5 hover:text-amber-500 cursor-pointer transition-colors" />
        </div>

        <p className="text-xs font-bold text-zinc-900 dark:text-white">
          1,482 likes
        </p>

        {/* Caption & Hashtags */}
        <div className="space-y-1.5 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed">
          <p className="whitespace-pre-line break-words">
            <strong className="font-bold text-zinc-900 dark:text-white mr-1.5">{username}</strong>
            {caption || 'Your Instagram caption will appear here in real-time...'}
          </p>

          {hashtags && hashtags.length > 0 && (
            <p className="text-purple-700 dark:text-purple-400 font-medium text-[11px] break-words">
              {hashtags.map(t => (t.startsWith('#') ? t : `#${t}`)).join(' ')}
            </p>
          )}
        </div>

        <div className="pt-1">
          <p className="text-[10px] text-zinc-400 uppercase tracking-wider">2 hours ago</p>
        </div>
      </div>
    </div>
  );
};
