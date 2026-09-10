import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Send, 
  Bookmark, 
  Image as ImageIcon, 
  Trash2, 
  Check, 
  RefreshCw,
  AlertCircle,
  Link as LinkIcon,
  Sliders,
  Layers,
  ArrowRight,
  ExternalLink,
  Upload,
  ImagePlus,
  Wand2,
  Plus,
  X,
  Hash,
  Heart,
  Bot,
  Copy,
  CheckCircle2,
  Share2,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  FileEdit
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { SocialPlatform, PlatformPostDraft } from '../types';
import { aiService } from '../services/aiService';
import { InstagramPreview } from '../components/studio/InstagramPreview';
import { FacebookPreview } from '../components/studio/FacebookPreview';
import { LinkedInPreview } from '../components/studio/LinkedInPreview';
import { XPreview } from '../components/studio/XPreview';
import { PreviewAllView } from '../components/studio/PreviewAllView';

type StudioPlatform = 'facebook' | 'linkedin' | 'instagram' | 'twitter';
type ViewMode = StudioPlatform | 'all';

const TONE_OPTIONS = [
  { id: 'BOLD', label: 'Bold', prompt: 'bold, energetic, and commanding' },
  { id: 'WITTY', label: 'Witty', prompt: 'witty, clever, and humorous' },
  { id: 'PROFESSIONAL', label: 'Professional', prompt: 'polished, authoritative, and business-focused' },
  { id: 'CASUAL', label: 'Casual', prompt: 'friendly, approachable, and authentic' },
  { id: 'INSPIRATIONAL', label: 'Inspirational', prompt: 'motivational, empowering, and uplifting' }
];

const DEFAULT_HASHTAG_CLOUD = [
  '#NetworkingNodes',
  '#AdventureAwaits',
  '#HelloWorld',
  '#LetsConnect',
  '#CommunityGrowth',
  '#NewBeginnings',
  '#SocialConnection',
  '#ProfessionalNetworking',
  '#LifeAdventure',
  '#ConnectAndGrow',
  '#MindsetMatters',
  '#VibeCheck',
  '#DigitalNetworking',
  '#CreativesUnite',
  '#CreatorEconomy'
];

const DEFAULT_MEDIA_BANNER = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1000&auto=format&fit=crop&q=80';

export const CreatePostWorkflowView: React.FC = () => {
  const { 
    socialAccounts, 
    brandSettings, 
    createPost, 
    updatePost, 
    editingPost, 
    setEditingPost, 
    prefilledContent, 
    setPrefilledContent,
    setCurrentView,
    addNotification 
  } = useApp();

  const { user } = useAuth();

  // Multi-platform selection state (Figure 5.11)
  const [selectedPlatforms, setSelectedPlatforms] = useState<StudioPlatform[]>(['facebook', 'linkedin']);
  const [previewTab, setPreviewTab] = useState<ViewMode>('facebook');

  // Core Content State (Figure 5.9)
  const [caption, setCaption] = useState<string>(
    editingPost?.caption || 
    prefilledContent?.caption || 
    'Have a great adventure. Let\'s connect and make things happen today!'
  );
  const [title, setTitle] = useState<string>(editingPost?.title || prefilledContent?.title || 'Connect & Grow Post');
  const [hashtags, setHashtags] = useState<string[]>(
    editingPost?.hashtags || 
    prefilledContent?.hashtags || 
    ['#NetworkingNodes', '#AdventureAwaits', '#HelloWorld', '#LetsConnect']
  );
  const [callToAction, setCallToAction] = useState<string>(prefilledContent?.callToAction || '');
  
  // Media State with File Info (Figure 5.9)
  const [mediaUrls, setMediaUrls] = useState<string[]>(
    editingPost?.media_urls?.length 
      ? editingPost.media_urls 
      : (prefilledContent?.media_urls?.length ? prefilledContent.media_urls : [DEFAULT_MEDIA_BANNER])
  );
  const [mediaFileInfo, setMediaFileInfo] = useState<string>('PNG • 0.29 MB');

  // AI Suggestion & Tone State (Figure 5.10)
  const [activeTone, setActiveTone] = useState<string>('BOLD');
  const [aiSuggestion, setAiSuggestion] = useState<string>(
    "Don't just watch the adventure happen — be part of it. Let's connect and make things happen today."
  );
  const [hashtagPool, setHashtagPool] = useState<string[]>(DEFAULT_HASHTAG_CLOUD);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // AI Assistant Modal / Drawer State
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [aiPromptInput, setAiPromptInput] = useState<string>(prefilledContent?.prompt || '');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);

  // Scheduling & Saving State (Figure 5.12)
  const [scheduleMode, setScheduleMode] = useState<'draft' | 'schedule' | 'now'>('draft');
  const [scheduleDate, setScheduleDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(10, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [customTagInput, setCustomTagInput] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Show auto-dismissing toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 2800);
  };

  // Sync editing post or prefilled content
  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title || '');
      setCaption(editingPost.caption || '');
      if (editingPost.hashtags?.length) setHashtags(editingPost.hashtags);
      if (editingPost.media_urls?.length) {
        setMediaUrls(editingPost.media_urls);
        setMediaFileInfo('JPG • 1.2 MB');
      }
      if (editingPost.platforms?.length) {
        const plats = editingPost.platforms.filter(p => ['facebook', 'linkedin', 'instagram', 'twitter'].includes(p)) as StudioPlatform[];
        if (plats.length > 0) {
          setSelectedPlatforms(plats);
          setPreviewTab(plats[0]);
        }
      }
    } else if (prefilledContent) {
      if (prefilledContent.title) setTitle(prefilledContent.title);
      if (prefilledContent.caption) setCaption(prefilledContent.caption);
      if (prefilledContent.hashtags?.length) setHashtags(prefilledContent.hashtags);
      if (prefilledContent.prompt) setAiPromptInput(prefilledContent.prompt);
      if (prefilledContent.suggestedMedia) {
        setMediaUrls([prefilledContent.suggestedMedia]);
        setMediaFileInfo('PNG • 0.54 MB');
      }
      if (prefilledContent.platform) {
        const plat = prefilledContent.platform as StudioPlatform;
        setSelectedPlatforms([plat]);
        setPreviewTab(plat);
      }
    }
  }, [editingPost, prefilledContent]);

  // Toggle platform in selection
  const handleTogglePlatform = (p: StudioPlatform) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        const updated = selectedPlatforms.filter(item => item !== p);
        setSelectedPlatforms(updated);
        if (previewTab === p) {
          setPreviewTab(updated[0]);
        }
      } else {
        triggerToast(`Keep at least one platform selected`);
      }
    } else {
      const updated = [...selectedPlatforms, p];
      setSelectedPlatforms(updated);
      setPreviewTab(p);
    }
  };

  // Add a single hashtag from pool to post
  const handleAddHashtag = (tag: string) => {
    const formatted = tag.startsWith('#') ? tag : `#${tag}`;
    if (!hashtags.includes(formatted)) {
      setHashtags(prev => [...prev, formatted]);
      triggerToast(`Added ${formatted}`);
    } else {
      triggerToast(`${formatted} already in post`);
    }
  };

  // Add all hashtags from pool
  const handleAddAllHashtags = () => {
    const combined = Array.from(new Set([...hashtags, ...hashtagPool]));
    setHashtags(combined);
    triggerToast(`Added all ${hashtagPool.length} hashtags`);
  };

  // Copy all hashtags to clipboard
  const handleCopyHashtags = () => {
    const textToCopy = hashtagPool.join(' ');
    navigator.clipboard.writeText(textToCopy);
    triggerToast('Copied hashtags to clipboard');
  };

  // Remove a hashtag from post
  const handleRemoveHashtag = (tagToRemove: string) => {
    setHashtags(prev => prev.filter(t => t !== tagToRemove));
  };

  // Apply AI Suggestion to caption
  const handleApplyAiSuggestion = () => {
    setCaption(aiSuggestion);
    triggerToast('Applied AI suggestion to caption');
  };

  // Switch Tone and generate new suggestion
  const handleToneChange = async (toneObj: typeof TONE_OPTIONS[0]) => {
    setActiveTone(toneObj.id);
    setIsGeneratingAi(true);
    try {
      const res = await aiService.generateStudioPost({
        prompt: caption || aiPromptInput || 'Social media update for my network and community',
        platform: selectedPlatforms[0] || 'facebook',
        tone: toneObj.label,
        brandSettings
      });
      if (res.success && res.data) {
        setAiSuggestion(res.data.caption);
        if (res.data.hashtags?.length) {
          setHashtagPool(res.data.hashtags);
        }
        triggerToast(`Generated ${toneObj.id} variation`);
      }
    } catch (err) {
      console.error(err);
      // Fallback smart suggestion
      if (toneObj.id === 'BOLD') {
        setAiSuggestion("Don't just watch the adventure happen — be part of it. Let's connect and make things happen today.");
      } else if (toneObj.id === 'WITTY') {
        setAiSuggestion("Plot twist: the best adventures start with a simple 'Hello'. Let's build something epic!");
      } else if (toneObj.id === 'PROFESSIONAL') {
        setAiSuggestion("Expanding strategic networks and exploring high-impact collaboration opportunities. Connect with us today.");
      } else if (toneObj.id === 'CASUAL') {
        setAiSuggestion("Hey everyone! Super excited for what's ahead. Drop a comment and let's stay connected.");
      } else {
        setAiSuggestion("Every great achievement begins with the courage to reach out. Keep creating and inspiring!");
      }
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Execute AI Generation from Prompt
  const handleExecuteAiGeneration = async () => {
    if (!aiPromptInput.trim()) {
      triggerToast('Please enter a description prompt');
      return;
    }

    setIsGeneratingAi(true);
    try {
      const targetPlatform = selectedPlatforms[0] || 'facebook';
      const res = await aiService.generateStudioPost({
        prompt: aiPromptInput,
        platform: targetPlatform,
        tone: activeTone,
        brandSettings
      });

      if (res.success && res.data) {
        const data = res.data;
        if (data.title) setTitle(data.title);
        if (data.caption) setCaption(data.caption);
        if (data.hashtags?.length) {
          setHashtags(data.hashtags);
          setHashtagPool(data.hashtags);
        }
        if (data.callToAction) setCallToAction(data.callToAction);
        setAiSuggestion(data.caption);

        // Auto-generate matching visual if requested
        if (data.mediaSuggestion || aiPromptInput) {
          try {
            const imgRes = await aiService.generateImage({
              prompt: data.mediaSuggestion || aiPromptInput,
              product: brandSettings?.brand_name || 'ViroAI Creator',
              style: 'Minimalist Studio',
              aspectRatio: '1:1'
            });
            if (imgRes.imageUrl) {
              setMediaUrls([imgRes.imageUrl]);
              setMediaFileInfo('PNG • 0.72 MB');
            }
          } catch (e) {
            console.warn(e);
          }
        }

        setShowAiModal(false);
        triggerToast('AI generated your post copy & visuals!');
      }
    } catch (err: any) {
      triggerToast(err.message || 'AI Generation failed');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Generate image directly
  const handleGenerateAiImage = async () => {
    setIsGeneratingImage(true);
    try {
      const res = await aiService.generateImage({
        prompt: caption || title || 'Modern community connection abstract minimal artwork',
        product: brandSettings?.brand_name || 'Social Network',
        style: 'Minimalist Studio',
        aspectRatio: '1:1'
      });
      if (res.imageUrl) {
        setMediaUrls([res.imageUrl]);
        setMediaFileInfo('PNG • 0.65 MB');
        triggerToast('AI visual generated and attached');
      }
    } catch (err: any) {
      triggerToast(err.message || 'Image generation failed');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Handle local file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      triggerToast('Please upload an image file (PNG/JPG)');
      return;
    }

    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    const ext = file.type.split('/')[1]?.toUpperCase() || 'PNG';
    setMediaFileInfo(`${ext} • ${sizeMb} MB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      if (res) {
        setMediaUrls([res]);
        triggerToast(`Uploaded ${file.name}`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save / Publish / Schedule Post
  const handleSavePost = async (action: 'draft' | 'schedule' | 'now') => {
    if (!caption.trim()) {
      triggerToast('Please write a caption before saving');
      return;
    }

    setIsSubmitting(true);
    try {
      let status: 'draft' | 'scheduled' | 'published' = 'draft';
      if (action === 'now') status = 'published';
      else if (action === 'schedule') status = 'scheduled';

      const payload = {
        title: title.trim() || `${selectedPlatforms[0]?.toUpperCase() || 'Social'} Post - ${new Date().toLocaleDateString()}`,
        content: caption,
        caption,
        hashtags,
        platforms: selectedPlatforms as SocialPlatform[],
        status,
        media_urls: mediaUrls,
        media_type: (mediaUrls.length > 0 ? 'image' : 'text') as any,
        scheduled_for: action === 'schedule' ? new Date(scheduleDate).toISOString() : null,
        published_at: action === 'now' ? new Date().toISOString() : null,
        ai_generated: true,
      };

      if (editingPost) {
        await updatePost(editingPost.id, payload);
        addNotification('Post Updated', `Successfully updated "${payload.title}"`, 'success');
        setEditingPost(null);
      } else {
        const created = await createPost(payload);
        if (action === 'now') {
          await aiService.publishPost({
            postId: created.id,
            platforms: selectedPlatforms as SocialPlatform[],
            title: payload.title,
            caption,
            mediaUrls,
          });
          addNotification('Published Live', `Published to ${selectedPlatforms.join(', ').toUpperCase()}`, 'success');
        } else if (action === 'schedule') {
          addNotification('Post Scheduled', `Scheduled for ${new Date(scheduleDate).toLocaleString()}`, 'success');
        } else {
          addNotification('Draft Saved', `Saved "${payload.title}" to drafts`, 'info');
        }
      }

      setPrefilledContent(null);
      setCurrentView('post-history');
    } catch (err: any) {
      console.error(err);
      triggerToast(err.message || 'Failed to save post');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Character limit validation
  const charLimit = 2200;
  const currentLength = caption.length + hashtags.join(' ').length;

  return (
    <div className="relative space-y-6 pb-20 max-w-7xl mx-auto">

      {/* Floating Toast Notification (matching Figure 5.10 reference toast) */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-950/95 px-5 py-2.5 text-xs font-semibold text-emerald-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar with 'Create Post' title and 'Save Draft' trigger (Figure 5.9) */}
      <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-6 py-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {editingPost ? 'Edit Post' : 'Create Post'}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Craft, enhance with AI suggestions & preview across your channels
          </p>
        </div>

        <div className="flex items-center gap-3">
          {editingPost && (
            <button
              onClick={() => {
                setEditingPost(null);
                setCurrentView('dashboard');
              }}
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          )}

          <button
            id="btn-save-draft-header"
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSavePost('draft')}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition-all cursor-pointer shadow-xs"
          >
            <Bookmark className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span>Save Draft</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout (Left: Creator & AI Hub | Right: Platform Selection & Live Device Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: Figure 5.9 & Figure 5.10 Content Workspace */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Card 1: Post Creation Workspace (Figure 5.9) */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80 space-y-4">
            
            {/* Attached Media Display with File Tag Badge */}
            <div className="relative group overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950 dark:border-zinc-800">
              {mediaUrls[0] ? (
                <div className="relative aspect-video sm:aspect-[16/9] w-full overflow-hidden bg-zinc-900 flex items-center justify-center">
                  <img 
                    src={mediaUrls[0]} 
                    alt="Attached post banner" 
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  
                  {/* File Format & Size Pill Tag (matching Figure 5.9: PNG • 0.29 MB) */}
                  <div className="absolute top-3 left-3 rounded-lg bg-black/70 px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-md shadow-md">
                    {mediaFileInfo}
                  </div>

                  {/* Media Quick Actions Hover Toolbar */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1 rounded-xl bg-white/90 px-3 py-1.5 text-xs font-bold text-zinc-900 hover:bg-white shadow-md transition-all cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Replace</span>
                    </button>
                    <button
                      type="button"
                      disabled={isGeneratingImage}
                      onClick={handleGenerateAiImage}
                      className="flex items-center gap-1 rounded-xl bg-purple-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-purple-700 shadow-md transition-all cursor-pointer"
                    >
                      <Wand2 className="h-3.5 w-3.5" />
                      <span>{isGeneratingImage ? 'Generating...' : 'AI Visual'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaUrls([]);
                        setMediaFileInfo('No media attached');
                      }}
                      className="rounded-xl bg-rose-600/90 p-2 text-white hover:bg-rose-700 shadow-md transition-all cursor-pointer"
                      title="Remove visual"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 rounded-2xl cursor-pointer hover:border-purple-400 transition-all"
                >
                  <ImagePlus className="h-8 w-8 text-zinc-400 dark:text-zinc-600 mb-2" />
                  <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Click to upload media banner</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Supports PNG, JPG (Target format: 1:1 or 16:9)</p>
                </div>
              )}

              {/* Hidden file input */}
              <input 
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {/* Post Headline / Campaign Title */}
            <div>
              <input
                id="input-post-headline"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title or campaign topic..."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs font-semibold text-zinc-900 focus:border-purple-600 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white transition-all"
              />
            </div>

            {/* Post Caption Textarea (Figure 5.9) */}
            <div className="relative">
              <textarea
                id="input-post-caption"
                rows={5}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Have a great adventure..."
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-xs sm:text-sm text-zinc-900 focus:border-purple-600 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white leading-relaxed resize-none transition-all"
              />
              <div className="flex justify-between items-center px-1 pt-1 text-[10px] text-zinc-400">
                <span>Auto-syncs to preview</span>
                <span className={currentLength > charLimit ? 'text-rose-500 font-bold' : ''}>
                  {currentLength} / {charLimit} chars
                </span>
              </div>
            </div>

            {/* Attached Hashtag Badges */}
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-lg border border-purple-200 bg-purple-50/80 px-2.5 py-1 text-[11px] font-semibold text-purple-800 dark:border-purple-900/60 dark:bg-purple-950/40 dark:text-purple-300"
                  >
                    <span>{tag.startsWith('#') ? tag : `#${tag}`}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHashtag(tag)}
                      className="text-purple-400 hover:text-purple-800 dark:hover:text-purple-100 cursor-pointer ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Quick Action Toolbar (Figure 5.9: #, Heart/Tone, and AI Assistant button) */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
              
              <div className="flex items-center gap-2">
                {/* Hashtags Drawer Button */}
                <button
                  id="btn-quick-hashtag"
                  type="button"
                  onClick={handleAddAllHashtags}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                  title="Add Trending Hashtags"
                >
                  <Hash className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </button>

                {/* Tone / Heart Preset Selector */}
                <div className="relative group">
                  <button
                    id="btn-quick-tone"
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                    title="Change Tone"
                  >
                    <Heart className="h-4 w-4 text-rose-500" />
                  </button>

                  {/* Tone Popover Menu on Hover/Click */}
                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:flex flex-col gap-1 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 z-30 min-w-[140px]">
                    <span className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                      Select Tone
                    </span>
                    {TONE_OPTIONS.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleToneChange(t)}
                        className={`text-left rounded-lg px-2 py-1 text-xs font-semibold transition-colors ${
                          activeTone === t.id 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' 
                            : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Primary AI Assistant Button (matching Figure 5.9: Orange/Purple prominent button) */}
              <button
                id="btn-trigger-ai-assistant"
                type="button"
                onClick={() => setShowAiModal(true)}
                className="flex items-center gap-2 rounded-xl bg-purple-800 px-4 py-2 text-xs font-bold text-white shadow-md shadow-purple-950/30 hover:bg-purple-700 active:scale-98 transition-all cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>AI Assistant</span>
              </button>

            </div>

          </div>

          {/* Card 2: AI Suggestions & Hashtags Section (Figure 5.10) */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80 space-y-5">
            
            {/* Tone Selector & AI Copy Suggestion (Figure 5.10) */}
            <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-4 dark:border-purple-950/80 dark:bg-purple-950/20 space-y-3">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-purple-800 px-2 py-0.5 text-[10px] font-bold text-white tracking-wider uppercase">
                    {activeTone}
                  </span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">AI Suggestion</span>
                </div>

                <button
                  type="button"
                  onClick={handleApplyAiSuggestion}
                  className="text-xs font-bold text-purple-700 dark:text-purple-400 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Apply to Caption</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium italic">
                "{aiSuggestion}"
              </p>

              {/* Tone Pill Switchers */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {TONE_OPTIONS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleToneChange(t)}
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      activeTone === t.id
                        ? 'bg-purple-800 text-white shadow-xs'
                        : 'border border-purple-200 bg-white text-purple-800 hover:bg-purple-100 dark:border-purple-900 dark:bg-zinc-900 dark:text-purple-300 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

            </div>

            {/* Hashtag Cloud with 'ADD ALL' and 'COPY' Buttons (Figure 5.10) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Hash className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                    # Hashtags
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    id="btn-add-all-hashtags"
                    type="button"
                    onClick={handleAddAllHashtags}
                    className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider hover:underline cursor-pointer"
                  >
                    ADD ALL
                  </button>
                  <button
                    id="btn-copy-hashtags"
                    type="button"
                    onClick={handleCopyHashtags}
                    className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white uppercase tracking-wider cursor-pointer flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    <span>COPY</span>
                  </button>
                </div>
              </div>

              {/* Hashtag Pill Cloud */}
              <div className="flex flex-wrap gap-2">
                {hashtagPool.map((tag) => {
                  const isAdded = hashtags.includes(tag);
                  return (
                    <button
                      key={tag}
                      id={`tag-pill-${tag.replace('#', '')}`}
                      type="button"
                      onClick={() => handleAddHashtag(tag)}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                        isAdded
                          ? 'border-purple-600 bg-purple-100 text-purple-900 dark:border-purple-500 dark:bg-purple-950 dark:text-purple-200'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-purple-800'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>

              {/* Custom Tag Input */}
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Type custom hashtag (e.g. #growth)..."
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (customTagInput.trim()) {
                        handleAddHashtag(customTagInput.trim());
                        setCustomTagInput('');
                      }
                    }
                  }}
                  className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-900 focus:border-purple-600 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customTagInput.trim()) {
                      handleAddHashtag(customTagInput.trim());
                      setCustomTagInput('');
                    }
                  }}
                  className="rounded-xl border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Figure 5.11 & Figure 5.12 Platform Selection */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Card 3: Platform Selection Section (Figure 5.11) */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80 space-y-4">
            
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                SELECT PLATFORMS
              </h2>
              <button
                type="button"
                onClick={() => setCurrentView('integrations')}
                className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider hover:underline cursor-pointer"
              >
                CONNECT ACCOUNT
              </button>
            </div>

            {/* Platform Toggle Tiles (Facebook, LinkedIn, Instagram, Twitter/X) */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { 
                  id: 'facebook' as StudioPlatform, 
                  label: 'Facebook', 
                  color: 'bg-[#1877F2] text-white border-[#1877F2]',
                  inactive: 'border-zinc-200 text-zinc-700 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300'
                },
                { 
                  id: 'linkedin' as StudioPlatform, 
                  label: 'LinkedIn', 
                  color: 'bg-[#0A66C2] text-white border-[#0A66C2]',
                  inactive: 'border-zinc-200 text-zinc-700 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300'
                },
                { 
                  id: 'instagram' as StudioPlatform, 
                  label: 'Instagram', 
                  color: 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white border-pink-500',
                  inactive: 'border-zinc-200 text-zinc-700 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300'
                },
                { 
                  id: 'twitter' as StudioPlatform, 
                  label: 'Twitter / X', 
                  color: 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-800 dark:border-zinc-700',
                  inactive: 'border-zinc-200 text-zinc-700 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300'
                },
              ].map((p) => {
                const isSelected = selectedPlatforms.includes(p.id);
                const isConnected = socialAccounts.find(s => s.platform === p.id && s.connected);

                return (
                  <button
                    key={p.id}
                    id={`btn-select-platform-${p.id}`}
                    type="button"
                    onClick={() => handleTogglePlatform(p.id)}
                    className={`flex items-center justify-between rounded-xl border p-3.5 text-xs font-bold transition-all shadow-xs cursor-pointer ${
                      isSelected ? p.color : p.inactive
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${isSelected ? 'bg-white ring-2 ring-white/40' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
                      <span>{p.label}</span>
                    </div>

                    <span className={`text-[10px] font-medium ${isSelected ? 'text-white/80' : 'text-zinc-400'}`}>
                      {isConnected ? 'Connected' : 'Simulated'}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Card 4: Platform Preview & Post Review Feed (Figure 5.11 & 5.12) */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80 space-y-4">
            
            {/* Header & Tabs */}
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                PLATFORM PREVIEW
              </h2>

              <div className="flex items-center gap-1">
                {(['linkedin', 'facebook', 'instagram', 'twitter'] as StudioPlatform[]).map((tab) => {
                  const isActive = previewTab === tab;
                  const labels: Record<StudioPlatform, string> = {
                    linkedin: 'LINKEDIN',
                    facebook: 'FACEBOOK',
                    instagram: 'INSTAGRAM',
                    twitter: 'X / TWITTER'
                  };

                  return (
                    <button
                      key={tab}
                      id={`tab-preview-${tab}`}
                      type="button"
                      onClick={() => setPreviewTab(tab)}
                      className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        isActive
                          ? 'bg-purple-800 text-white shadow-xs'
                          : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                      }`}
                    >
                      {labels[tab]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Platform Identifier Banner */}
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                {previewTab === 'facebook' && 'FACEBOOK'}
                {previewTab === 'linkedin' && 'LINKEDIN'}
                {previewTab === 'instagram' && 'INSTAGRAM'}
                {previewTab === 'twitter' && 'TWITTER / X'}
                {previewTab === 'all' && 'ALL CHANNELS'}
              </span>
              <span className="text-[11px] text-zinc-400">Live Device Simulation</span>
            </div>

            {/* Interactive Post Review Frame (Figure 5.12) */}
            <div className="pt-1">
              {previewTab === 'facebook' && (
                <FacebookPreview
                  caption={caption}
                  hashtags={hashtags}
                  callToAction={callToAction}
                  mediaUrl={mediaUrls[0]}
                  brandSettings={brandSettings}
                  authorName={user?.full_name || brandSettings?.brand_name}
                  authorAvatar={user?.avatar_url || brandSettings?.logo_url}
                />
              )}

              {previewTab === 'linkedin' && (
                <LinkedInPreview
                  caption={caption}
                  hashtags={hashtags}
                  callToAction={callToAction}
                  mediaUrl={mediaUrls[0]}
                  brandSettings={brandSettings}
                  authorName={user?.full_name || brandSettings?.brand_name}
                  authorAvatar={user?.avatar_url || brandSettings?.logo_url}
                />
              )}

              {previewTab === 'instagram' && (
                <InstagramPreview
                  caption={caption}
                  hashtags={hashtags}
                  callToAction={callToAction}
                  mediaUrl={mediaUrls[0]}
                  brandSettings={brandSettings}
                  authorName={user?.full_name || brandSettings?.brand_name}
                  authorAvatar={user?.avatar_url || brandSettings?.logo_url}
                />
              )}

              {previewTab === 'twitter' && (
                <XPreview
                  caption={caption}
                  hashtags={hashtags}
                  callToAction={callToAction}
                  mediaUrl={mediaUrls[0]}
                  brandSettings={brandSettings}
                  authorName={user?.full_name || brandSettings?.brand_name}
                  authorAvatar={user?.avatar_url || brandSettings?.logo_url}
                />
              )}
            </div>

            {/* Bottom Actions: Scheduling & Publishing Controls (Figure 5.12) */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
              
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'draft', label: 'Save Draft', icon: Bookmark },
                  { id: 'schedule', label: 'Schedule', icon: Calendar },
                  { id: 'now', label: 'Publish Live', icon: Send },
                ].map((act) => {
                  const Icon = act.icon;
                  const isAct = scheduleMode === act.id;
                  return (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => setScheduleMode(act.id as any)}
                      className={`flex flex-col items-center justify-center rounded-xl border p-2 text-xs font-bold transition-all cursor-pointer ${
                        isAct
                          ? 'border-purple-600 bg-purple-50/80 text-purple-800 dark:border-purple-500 dark:bg-purple-950/60 dark:text-purple-300 shadow-xs'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400'
                      }`}
                    >
                      <Icon className="h-4 w-4 mb-0.5" />
                      <span>{act.label}</span>
                    </button>
                  );
                })}
              </div>

              {scheduleMode === 'schedule' && (
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                    Select Date & Time (Local)
                  </label>
                  <input
                    id="input-schedule-datetime"
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-purple-600 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  />
                </div>
              )}

              <button
                id="btn-main-submit-post"
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSavePost(scheduleMode)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-800 py-3 text-xs font-bold text-white shadow-md shadow-purple-950/30 hover:bg-purple-700 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </span>
                ) : (
                  <>
                    {scheduleMode === 'draft' && <Bookmark className="h-4 w-4" />}
                    {scheduleMode === 'schedule' && <Calendar className="h-4 w-4" />}
                    {scheduleMode === 'now' && <Send className="h-4 w-4" />}
                    <span>
                      {scheduleMode === 'draft' && 'Save Draft to Workspace'}
                      {scheduleMode === 'schedule' && `Schedule for ${new Date(scheduleDate).toLocaleDateString()}`}
                      {scheduleMode === 'now' && `Publish to ${selectedPlatforms.join(' & ').toUpperCase()}`}
                    </span>
                  </>
                )}
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* AI Assistant Modal (Prompt Studio) */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-800 text-white">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">AI Assistant Studio</h3>
                  <p className="text-[10px] text-zinc-400">Describe your concept and let Gemini craft complete copy & tags</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 py-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Content Idea or Topic Prompt
                </label>
                <textarea
                  rows={4}
                  value={aiPromptInput}
                  onChange={(e) => setAiPromptInput(e.target.value)}
                  placeholder="e.g. Create a post introducing our new summer connection event. Highlight networking, collaboration, and include bold motivational copy."
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-900 focus:border-purple-600 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Target Tone
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TONE_OPTIONS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveTone(t.id)}
                      className={`rounded-xl border py-2 text-xs font-bold transition-all ${
                        activeTone === t.id
                          ? 'border-purple-600 bg-purple-800 text-white'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isGeneratingAi || !aiPromptInput.trim()}
                onClick={handleExecuteAiGeneration}
                className="flex items-center gap-2 rounded-xl bg-purple-800 px-5 py-2 text-xs font-bold text-white shadow-md shadow-purple-900/30 hover:bg-purple-700 disabled:opacity-50 cursor-pointer"
              >
                {isGeneratingAi ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Generate Copy & Visuals</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
