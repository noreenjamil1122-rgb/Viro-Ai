import React from 'react';
import { MessageCircle, Repeat2, Heart, Bookmark, Share, MoreHorizontal, Image as ImageIcon } from 'lucide-react';
import { BrandSettings } from '../../types';

interface XPreviewProps {
  caption: string;
  hashtags: string[];
  callToAction?: string;
  mediaUrl?: string;
  brandSettings?: BrandSettings;
  authorName?: string;
  authorAvatar?: string;
}

export const XPreview: React.FC<XPreviewProps> = ({
  caption,
  hashtags,
  callToAction,
  mediaUrl,
  brandSettings,
  authorName,
  authorAvatar,
}) => {
  const displayName = brandSettings?.brand_name || authorName || 'ViroAI';
  const handle = brandSettings?.brand_name 
    ? `@${brandSettings.brand_name.toLowerCase().replace(/\s+/g, '')}`
    : (authorName ? `@${authorName.toLowerCase().replace(/\s+/g, '')}` : '@viroai_app');

  const avatar = brandSettings?.logo_url || authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80";

  // Calculate total X characters (including hashtags)
  const fullText = `${caption} ${hashtags.map(t => (t.startsWith('#') ? t : `#${t}`)).join(' ')}`.trim();
  const charCount = fullText.length;
  const isOverLimit = charCount > 280;

  return (
    <div id="preview-x-card" className="w-full max-w-sm mx-auto overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-900">
      {/* Post container */}
      <div className="p-3.5 space-y-2.5">
        {/* Author Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <img 
              src={avatar} 
              alt={displayName} 
              referrerPolicy="no-referrer"
              className="h-9 w-9 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <p className="font-bold text-zinc-900 dark:text-white text-xs truncate">
                  {displayName}
                </p>
                <span className="text-[10px] text-blue-500 font-bold">✓</span>
                <span className="text-[11px] text-zinc-400 truncate">{handle}</span>
                <span className="text-[10px] text-zinc-400 shrink-0">· 2h</span>
              </div>
            </div>
          </div>
          <button type="button" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Tweet Body */}
        <div className="space-y-1.5 text-xs text-zinc-900 dark:text-zinc-100 pl-11">
          <p className="whitespace-pre-line leading-relaxed break-words font-normal">
            {caption || 'What is happening?! Your post will appear here...'}
          </p>

          {hashtags && hashtags.length > 0 && (
            <p className="text-sky-500 dark:text-sky-400 font-medium text-[11px] break-words">
              {hashtags.map(t => (t.startsWith('#') ? t : `#${t}`)).join(' ')}
            </p>
          )}

          {callToAction && (
            <p className="text-zinc-500 dark:text-zinc-400 text-[11px] italic">
              👉 {callToAction}
            </p>
          )}

          {/* Media Attachment */}
          <div className="mt-2.5 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 aspect-video relative flex items-center justify-center">
            {mediaUrl ? (
              <img 
                src={mediaUrl} 
                alt="Tweet media" 
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover" 
              />
            ) : (
              <div className="text-center p-4 text-zinc-400 dark:text-zinc-600">
                <ImageIcon className="h-7 w-7 mx-auto mb-1 opacity-50 stroke-[1.5]" />
                <p className="text-[11px] font-semibold">Media preview</p>
                <p className="text-[9px] text-zinc-400 mt-0.5">16:9 Landscape</p>
              </div>
            )}
          </div>

          {/* Character limit badge for X */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-1">
              <span className={`text-[10px] font-mono font-bold ${isOverLimit ? 'text-rose-500' : 'text-zinc-400'}`}>
                {charCount} / 280 chars
              </span>
              {isOverLimit && (
                <span className="text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded">
                  Exceeds limit
                </span>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between text-zinc-400 pt-1">
            <button type="button" className="flex items-center gap-1 hover:text-sky-500 text-[11px] transition-colors">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>24</span>
            </button>
            <button type="button" className="flex items-center gap-1 hover:text-emerald-500 text-[11px] transition-colors">
              <Repeat2 className="h-3.5 w-3.5" />
              <span>42</span>
            </button>
            <button type="button" className="flex items-center gap-1 hover:text-rose-500 text-[11px] transition-colors">
              <Heart className="h-3.5 w-3.5" />
              <span>189</span>
            </button>
            <button type="button" className="flex items-center gap-1 hover:text-amber-500 text-[11px] transition-colors">
              <Bookmark className="h-3.5 w-3.5" />
            </button>
            <button type="button" className="flex items-center gap-1 hover:text-purple-500 text-[11px] transition-colors">
              <Share className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
