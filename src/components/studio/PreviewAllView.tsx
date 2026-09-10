import React from 'react';
import { InstagramPreview } from './InstagramPreview';
import { FacebookPreview } from './FacebookPreview';
import { LinkedInPreview } from './LinkedInPreview';
import { XPreview } from './XPreview';
import { BrandSettings, PlatformPostDraft } from '../../types';

interface PreviewAllViewProps {
  caption: string;
  hashtags: string[];
  callToAction?: string;
  mediaUrl?: string;
  brandSettings?: BrandSettings;
  authorName?: string;
  authorAvatar?: string;
  platformVariations?: {
    instagram?: PlatformPostDraft;
    facebook?: PlatformPostDraft;
    linkedin?: PlatformPostDraft;
    twitter?: PlatformPostDraft;
  };
}

export const PreviewAllView: React.FC<PreviewAllViewProps> = ({
  caption,
  hashtags,
  callToAction,
  mediaUrl,
  brandSettings,
  authorName,
  authorAvatar,
  platformVariations,
}) => {
  return (
    <div id="preview-all-platforms-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Instagram Card */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Instagram Feed
          </span>
          <span className="text-[10px] text-zinc-400">1:1 Visual Focus</span>
        </div>
        <InstagramPreview
          caption={platformVariations?.instagram?.caption || caption}
          hashtags={platformVariations?.instagram?.hashtags || hashtags}
          callToAction={platformVariations?.instagram?.callToAction || callToAction}
          mediaUrl={mediaUrl}
          brandSettings={brandSettings}
          authorName={authorName}
          authorAvatar={authorAvatar}
        />
      </div>

      {/* LinkedIn Card */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            LinkedIn Post
          </span>
          <span className="text-[10px] text-zinc-400">Professional Network</span>
        </div>
        <LinkedInPreview
          caption={platformVariations?.linkedin?.caption || caption}
          hashtags={platformVariations?.linkedin?.hashtags || hashtags}
          callToAction={platformVariations?.linkedin?.callToAction || callToAction}
          mediaUrl={mediaUrl}
          brandSettings={brandSettings}
          authorName={authorName}
          authorAvatar={authorAvatar}
        />
      </div>

      {/* Facebook Card */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-500">
            Facebook Feed
          </span>
          <span className="text-[10px] text-zinc-400">Community & Link</span>
        </div>
        <FacebookPreview
          caption={platformVariations?.facebook?.caption || caption}
          hashtags={platformVariations?.facebook?.hashtags || hashtags}
          callToAction={platformVariations?.facebook?.callToAction || callToAction}
          mediaUrl={mediaUrl}
          brandSettings={brandSettings}
          authorName={authorName}
          authorAvatar={authorAvatar}
        />
      </div>

      {/* X Card */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
            X (Twitter)
          </span>
          <span className="text-[10px] text-zinc-400">280 Char Limit</span>
        </div>
        <XPreview
          caption={platformVariations?.twitter?.caption || caption}
          hashtags={platformVariations?.twitter?.hashtags || hashtags}
          callToAction={platformVariations?.twitter?.callToAction || callToAction}
          mediaUrl={mediaUrl}
          brandSettings={brandSettings}
          authorName={authorName}
          authorAvatar={authorAvatar}
        />
      </div>
    </div>
  );
};
