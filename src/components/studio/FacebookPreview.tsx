import React from 'react';
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal, Globe, Image as ImageIcon } from 'lucide-react';
import { BrandSettings } from '../../types';

interface FacebookPreviewProps {
  caption: string;
  hashtags: string[];
  callToAction?: string;
  mediaUrl?: string;
  brandSettings?: BrandSettings;
  authorName?: string;
  authorAvatar?: string;
}

export const FacebookPreview: React.FC<FacebookPreviewProps> = ({
  caption,
  hashtags,
  callToAction,
  mediaUrl,
  brandSettings,
  authorName,
  authorAvatar,
}) => {
  const displayName = brandSettings?.brand_name || authorName || 'ViroAI';
  const avatar = brandSettings?.logo_url || authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80";

  return (
    <div id="preview-facebook-card" className="w-full max-w-sm mx-auto overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <img 
            src={avatar} 
            alt={displayName} 
            referrerPolicy="no-referrer"
            className="h-9 w-9 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
          />
          <div>
            <p className="font-bold text-zinc-900 dark:text-white text-xs leading-tight">
              {displayName}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-zinc-400 mt-0.5">
              <span>Just now</span>
              <span>•</span>
              <Globe className="h-3 w-3" />
            </div>
          </div>
        </div>
        <button type="button" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Post Text */}
      <div className="p-3.5 space-y-2 text-xs text-zinc-800 dark:text-zinc-200">
        <p className="whitespace-pre-line leading-relaxed break-words">
          {caption || 'Your Facebook post copy will appear here in real-time...'}
        </p>

        {hashtags && hashtags.length > 0 && (
          <p className="text-blue-600 dark:text-blue-400 font-medium text-[11px] break-words">
            {hashtags.map(t => (t.startsWith('#') ? t : `#${t}`)).join(' ')}
          </p>
        )}
      </div>

      {/* Media */}
      <div className="aspect-video bg-zinc-100 dark:bg-zinc-950 relative overflow-hidden flex items-center justify-center border-y border-zinc-100 dark:border-zinc-800/60">
        {mediaUrl ? (
          <img 
            src={mediaUrl} 
            alt="Facebook post visual" 
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover" 
          />
        ) : (
          <div className="text-center p-6 text-zinc-400 dark:text-zinc-600">
            <ImageIcon className="h-8 w-8 mx-auto mb-1.5 opacity-50 stroke-[1.5]" />
            <p className="text-xs font-semibold">Media preview</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Landscape or 4:3 photo</p>
          </div>
        )}
      </div>

      {/* CTA Box if present */}
      {callToAction && (
        <div className="bg-zinc-50 dark:bg-zinc-950/60 p-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <p className="text-[10px] uppercase font-bold text-zinc-400">viroai.com</p>
            <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{callToAction}</p>
          </div>
          <button type="button" className="px-3 py-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg text-xs font-bold shrink-0">
            Learn More
          </button>
        </div>
      )}

      {/* Reactions stats */}
      <div className="flex items-center justify-between px-3.5 py-2 text-[11px] text-zinc-500 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-600 text-white text-[9px]">👍</span>
          <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-rose-500 text-white text-[9px]">❤️</span>
          <span>142</span>
        </div>
        <div className="flex items-center gap-2">
          <span>28 comments</span>
          <span>•</span>
          <span>14 shares</span>
        </div>
      </div>

      {/* Action Row */}
      <div className="grid grid-cols-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
        <button type="button" className="flex items-center justify-center gap-1.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-md transition-colors">
          <ThumbsUp className="h-4 w-4 text-blue-600" />
          <span>Like</span>
        </button>
        <button type="button" className="flex items-center justify-center gap-1.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-md transition-colors">
          <MessageSquare className="h-4 w-4" />
          <span>Comment</span>
        </button>
        <button type="button" className="flex items-center justify-center gap-1.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-md transition-colors">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};
