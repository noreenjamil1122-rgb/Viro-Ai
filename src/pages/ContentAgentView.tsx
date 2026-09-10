import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  Calendar, 
  RefreshCw, 
  Layers, 
  Share2, 
  HelpCircle, 
  Sliders, 
  FileText, 
  Tag, 
  Video, 
  ArrowRight,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { aiService } from '../services/aiService';
import { GeneratedContentResult, SocialPlatform } from '../types';

export const ContentAgentView: React.FC = () => {
  const { 
    brandSettings, 
    setCurrentView, 
    setPrefilledContent, 
    createPost, 
    addNotification 
  } = useApp();

  // Form State
  const [productName, setProductName] = useState(brandSettings.brand_name || '');
  const [productDescription, setProductDescription] = useState(
    brandSettings.tagline ? `${brandSettings.brand_name ? brandSettings.brand_name + ' - ' : ''}${brandSettings.tagline}` : ''
  );
  const [keywords, setKeywords] = useState(brandSettings.default_hashtags?.join(', ') || '');
  const [targetAudience, setTargetAudience] = useState(brandSettings.target_audience || '');
  const [marketingGoal, setMarketingGoal] = useState('');
  const [platform, setPlatform] = useState<SocialPlatform>('instagram');
  const [tone, setTone] = useState(brandSettings.tone_of_voice || 'Professional & Energetic');
  const [customPrompt, setCustomPrompt] = useState('');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<GeneratedContentResult | null>(null);
  const [activeCaptionIndex, setActiveCaptionIndex] = useState<number>(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [dataSource, setDataSource] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleUseBrandDefaults = () => {
    setProductName(brandSettings.brand_name);
    setProductDescription(`${brandSettings.brand_name} - ${brandSettings.tagline}`);
    setTargetAudience(brandSettings.target_audience);
    setTone(brandSettings.tone_of_voice);
    if (brandSettings.default_hashtags?.length) {
      setKeywords(brandSettings.default_hashtags.join(', '));
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !productDescription.trim()) return;

    setIsGenerating(true);
    setSaveStatus('idle');

    try {
      const res = await aiService.generateContent({
        productName,
        productDescription,
        keywords,
        targetAudience,
        marketingGoal,
        platform,
        tone,
        customPrompt,
        brandSettings,
      });

      setGeneratedData(res.data);
      setDataSource(res.source || 'gemini');
      addNotification(
        'Content Agent Completed',
        `Formulated 5 captions, 15 hashtags, and creative hooks for ${productName}.`,
        'success'
      );
    } catch (err: any) {
      addNotification('Generation Notice', err.message || 'Error executing Content Agent', 'warning');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!generatedData) return;
    setSaveStatus('saving');

    const selectedCaption = generatedData.shortCaptions[activeCaptionIndex] || generatedData.longCaptions[0] || '';
    const hashtagsString = generatedData.hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' ');

    await createPost({
      title: `${productName} - AI Social Post`,
      caption: `${selectedCaption}\n\n${hashtagsString}`,
      platforms: [platform],
      status: 'draft',
      ai_generated: true,
      hashtags: generatedData.hashtags,
    });

    setSaveStatus('saved');
    addNotification('Draft Saved', 'Post content successfully saved to your Post History library.', 'success');
  };

  const handleContinueToStudio = () => {
    if (!generatedData) return;
    const selectedCaption = generatedData.shortCaptions[activeCaptionIndex] || generatedData.longCaptions[0] || '';
    const hashtagsString = generatedData.hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' ');

    setPrefilledContent({
      title: `${productName} - Campaign`,
      caption: `${selectedCaption}\n\n${hashtagsString}`,
      platform,
      hashtags: generatedData.hashtags,
      prompt: `${productName} ${targetAudience ? `- ${targetAudience}` : ''} ${marketingGoal ? `for ${marketingGoal}` : ''}`,
    });

    setCurrentView('create-post');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:text-purple-300 dark:bg-purple-950 dark:text-purple-400">
                Content Module
              </span>
              <span className="text-xs text-zinc-400">• Text Generation</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
              Content Generator
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Generate structured captions, hooks, hashtags, and call-to-actions aligned with your brand.
            </p>
          </div>

          <button
            onClick={handleUseBrandDefaults}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span>Load Brand Defaults</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Generator Form */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleGenerate} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5" />
              <span>Campaign & Product Parameters</span>
            </h2>

            {/* Product Name */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Product / Service / Topic Name *
              </label>
              <input
                id="input-content-product-name"
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter your product or service"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-purple-700 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:bg-zinc-900"
              />
            </div>

            {/* Product Description */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Description & Value Proposition *
              </label>
              <textarea
                id="input-content-product-description"
                required
                rows={3}
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Describe your business or campaign..."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-purple-700 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:bg-zinc-900"
              />
            </div>

            {/* Target Platform */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Target Social Platform
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {(['instagram', 'linkedin', 'twitter', 'facebook', 'tiktok'] as SocialPlatform[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlatform(p)}
                    className={`rounded-lg py-1.5 text-[11px] font-bold capitalize transition-all ${
                      platform === p 
                        ? 'bg-purple-800 text-white shadow-xs' 
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {p === 'twitter' ? 'X' : p}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone of Voice */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Tone of Voice
              </label>
              <select
                id="select-content-tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-purple-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              >
                <option value="Professional & Authoritative">Professional & Authoritative</option>
                <option value="Energetic & Bold">Energetic & Bold</option>
                <option value="Casual & Relatable">Casual & Relatable</option>
                <option value="Inspirational & Storytelling">Inspirational & Storytelling</option>
                <option value="Educational & Insightful">Educational & Insightful</option>
                <option value="Witty & Viral">Witty & Viral</option>
              </select>
            </div>

            {/* Target Audience & Goal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Enter your target audience"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-purple-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Marketing Goal
                </label>
                <input
                  type="text"
                  value={marketingGoal}
                  onChange={(e) => setMarketingGoal(e.target.value)}
                  placeholder="Enter marketing goal"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-purple-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
              </div>
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Target Keywords & Tags
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Enter keywords"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-purple-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              />
            </div>

            {/* Custom Prompt Instruction */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Custom Instruction (Optional)
              </label>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. Emphasize a 30% limited launch discount"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-purple-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              />
            </div>

            {/* Submit Button */}
            <button
              id="btn-run-content-agent"
              type="submit"
              disabled={isGenerating}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-800 py-3 text-xs font-bold text-white shadow-md shadow-purple-950/30 hover:bg-purple-700 transition-all disabled:opacity-60 active:scale-98"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Agent Synthesizing Strategy & Copy...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Multi-Platform Copy</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Results & Artifacts */}
        <div className="lg:col-span-7 space-y-4">
          {!generatedData && !isGenerating && (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 dark:text-purple-300 dark:bg-purple-950 dark:text-purple-400 mb-3">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                Ready to Generate Content
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
                Enter your product details on the left and click "Generate" to formulate multi-angle captions, hashtags, hooks, and video ideas.
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="h-10 w-10 animate-spin rounded-full border-3 border-purple-600 border-t-transparent mb-4" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Content Agent at Work
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
                Analyzing brand voice, drafting hook variations, clustering high-volume hashtags, and structuring marketing copy...
              </p>
            </div>
          )}

          {generatedData && !isGenerating && (
            <div className="space-y-4">
              {/* Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-zinc-200 bg-white p-3 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                    Generated via {dataSource === 'gemini' ? 'Gemini AI' : 'ViroAI Engine'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="btn-save-content-draft"
                    onClick={handleSaveDraft}
                    disabled={saveStatus === 'saving' || saveStatus === 'saved'}
                    className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    {saveStatus === 'saved' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Bookmark className="h-3.5 w-3.5 text-zinc-500" />}
                    <span>{saveStatus === 'saved' ? 'Saved to Drafts' : 'Save as Draft'}</span>
                  </button>

                  <button
                    id="btn-continue-create-post"
                    onClick={handleContinueToStudio}
                    className="flex items-center gap-1.5 rounded-lg bg-purple-800 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition-all active:scale-98"
                  >
                    <span>Send to Post Studio</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* 1. Short Captions */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Short Captions (Instagram / X / Threads)</span>
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {generatedData.shortCaptions?.map((cap, i) => (
                    <div 
                      key={i}
                      onClick={() => setActiveCaptionIndex(i)}
                      className={`group relative rounded-xl border p-3 cursor-pointer transition-all ${
                        activeCaptionIndex === i 
                          ? 'border-purple-700 bg-purple-50/40 dark:bg-purple-950/20' 
                          : 'border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-950/40 dark:hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed flex-1">
                          {cap}
                        </p>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCopy(cap, `short-${i}`); }}
                          className="rounded-md p-1 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-white"
                          title="Copy Caption"
                        >
                          {copiedKey === `short-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                      <span className="text-[10px] text-zinc-400 mt-1 block">
                        {cap.length} characters • {activeCaptionIndex === i ? 'Selected for Post' : 'Click to select'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Long Form / LinkedIn Captions */}
              {generatedData.longCaptions && generatedData.longCaptions.length > 0 && (
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-blue-500" />
                    <span>Long-Form Storytelling (LinkedIn & Facebook)</span>
                  </h3>

                  <div className="space-y-3">
                    {generatedData.longCaptions.map((longCap, i) => (
                      <div key={i} className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-950/40">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-xs text-zinc-800 dark:text-zinc-200 whitespace-pre-line leading-relaxed flex-1">
                            {longCap}
                          </p>
                          <button
                            onClick={() => handleCopy(longCap, `long-${i}`)}
                            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-white flex-shrink-0"
                            title="Copy Long Caption"
                          >
                            {copiedKey === `long-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Niche Hashtag Cloud */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Clustered Hashtags ({generatedData.hashtags.length})</span>
                  </h3>
                  <button
                    onClick={() => handleCopy(generatedData.hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' '), 'all-tags')}
                    className="text-xs text-purple-700 dark:text-purple-300 dark:text-purple-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    {copiedKey === 'all-tags' ? 'Copied all!' : 'Copy all tags'}
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {generatedData.hashtags.map((tag, idx) => {
                    const cleanTag = tag.startsWith('#') ? tag : `#${tag}`;
                    return (
                      <span
                        key={idx}
                        onClick={() => handleCopy(cleanTag, `tag-${idx}`)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] font-medium text-zinc-700 hover:border-purple-700 hover:bg-purple-50 hover:text-purple-700 dark:text-purple-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-purple-700 dark:hover:bg-purple-950/40"
                      >
                        {cleanTag}
                        {copiedKey === `tag-${idx}` && <Check className="h-3 w-3 text-emerald-500" />}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* 4. Creative Angles & Video Storyboard Idea */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2 flex items-center gap-1.5">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                    <span>Creative Angles & Hooks</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                    {generatedData.promotionalAngles?.map((angle, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-bold text-purple-600 dark:text-purple-400">•</span>
                        <span>{angle}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2 flex items-center gap-1.5">
                    <Video className="h-3.5 w-3.5 text-rose-500" />
                    <span>Reel / Video Hook</span>
                  </h4>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {generatedData.videoScriptIdea || "Hook: 'If you are still managing social manually in 2026, you need to see this.' Focus on the multi-agent automation demo."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
