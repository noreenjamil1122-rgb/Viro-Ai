import React from 'react';
import { ThumbsUp, MessageSquare, Repeat2, Send, Globe, MoreHorizontal, Image as ImageIcon } from 'lucide-react';
import { BrandSettings } from '../../types';

interface LinkedInPreviewProps {
  caption: string;
  hashtags: string[];
  callToAction?: string;
  mediaUrl?: string;
  brandSettings?: BrandSettings;
  authorName?: string;
  authorAvatar?: string;
}

export const LinkedInPreview: React.FC<LinkedInPreviewProps> = ({
  caption,
  hashtags,
  callToAction,
  mediaUrl,
  brandSettings,
  authorName,
  authorAvatar,
}) => {
  const author = authorName || brandSettings?.brand_name || 'ViroAI User';
  const avatar = authorAvatar || brandSettings?.logo_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80";

  return (
    <div id="preview-linkedin-card" className="w-full max-w-sm mx-auto overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-start justify-between p-3.5 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <img 
            src={avatar} 
            alt={author} 
            referrerPolicy="no-referrer"
            className="h-10 w-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-bold text-zinc-900 dark:text-white text-xs leading-tight">
                {author}
              </p>
              <span className="text-[10px] text-zinc-400">• 1st</span>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate max-w-[180px]">
              {brandSettings?.tagline || 'Founder & CEO • Marketing Strategy & Growth'}
            </p>
            <div className="flex items-center gap-1 text-[9px] text-zinc-400 mt-0.5">
              <span>1d</span>
              <span>•</span>
              <Globe className="h-2.5 w-2.5" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-zinc-400">
          <button type="button" className="text-blue-600 dark:text-blue-400 font-bold text-xs hover:underline mr-1">
            + Follow
          </button>
          <MoreHorizontal className="h-4 w-4" />
        </div>
      </div>

      {/* Post Text */}
      <div className="p-3.5 space-y-2 text-xs text-zinc-800 dark:text-zinc-200">
        <p className="whitespace-pre-line leading-relaxed break-words font-normal">
          {caption || 'Share your professional insights, case studies, or business updates here...'}
        </p>

        {hashtags && hashtags.length > 0 && (
          <p className="text-blue-700 dark:text-blue-400 font-medium text-[11px] break-words">
            {hashtags.map(t => (t.startsWith('#') ? t : `#${t}`)).join(' ')}
          </p>
        )}
      </div>

      {/* Media Frame */}
      <div className="aspect-video bg-zinc-100 dark:bg-zinc-950 relative overflow-hidden flex items-center justify-center border-y border-zinc-100 dark:border-zinc-800/60">
        {mediaUrl ? (
          <img 
            src={mediaUrl} 
            alt="LinkedIn post visual" 
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover" 
          />
        ) : (
          <div className="text-center p-6 text-zinc-400 dark:text-zinc-600">
            <ImageIcon className="h-8 w-8 mx-auto mb-1.5 opacity-50 stroke-[1.5]" />
            <p className="text-xs font-semibold">Media preview</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Presentation slide or infographic</p>
          </div>
        )}
      </div>

      {/* CTA Box if present */}
      {callToAction && (
        <div className="bg-zinc-50 dark:bg-zinc-950/60 p-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{callToAction}</p>
            <p className="text-[10px] text-zinc-400">viroai.com</p>
          </div>
          <button type="button" className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-bold shrink-0 hover:bg-blue-700">
            View
          </button>
        </div>
      )}

      {/* Reactions stats */}
      <div className="flex items-center justify-between px-3.5 py-2 text-[11px] text-zinc-500 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-1">
          <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-600 text-white text-[8px]">👍</span>
          <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-green-600 text-white text-[8px]">👏</span>
          <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-amber-500 text-white text-[8px]">💡</span>
          <span className="ml-1">384</span>
        </div>
        <div className="flex items-center gap-2">
          <span>45 comments</span>
          <span>•</span>
          <span>19 reposts</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="grid grid-cols-4 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
        <button type="button" className="flex items-center justify-center gap-1.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-md transition-colors">
          <ThumbsUp className="h-3.5 w-3.5 text-blue-600" />
          <span className="text-[11px]">Like</span>
        </button>
        <button type="button" className="flex items-center justify-center gap-1.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-md transition-colors">
          <MessageSquare className="h-3.5 w-3.5" />
          <span className="text-[11px]">Comment</span>
        </button>
        <button type="button" className="flex items-center justify-center gap-1.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-md transition-colors">
          <Repeat2 className="h-3.5 w-3.5" />
          <span className="text-[11px]">Repost</span>
        </button>
        <button type="button" className="flex items-center justify-center gap-1.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-md transition-colors">
          <Send className="h-3.5 w-3.5" />
          <span className="text-[11px]">Send</span>
        </button>
      </div>
    </div>
  );
};
