import React, { useState } from 'react';
import { 
  Hash, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  Sliders, 
  ArrowRight, 
  Send,
  Zap,
  TrendingUp,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { aiService } from '../services/aiService';
import { GeneratedQuickCopyResult, SocialPlatform } from '../types';

export const HashtagCaptionQuickView: React.FC = () => {
  const { setCurrentView, setPrefilledContent, addNotification } = useApp();

  const [topic, setTopic] = useState('Artificial Intelligence for Small Business');
  const [niche, setNiche] = useState('B2B SaaS & Automation');
  const [platform, setPlatform] = useState<SocialPlatform>('instagram');
  const [tone, setTone] = useState('Punchy & High Energy');

  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedQuickCopyResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    try {
      const res = await aiService.quickGenerate({
        topic,
        niche,
        platform,
        tone,
      });
      setResult(res.data);
      addNotification('Hashtags & Captions Ready', `Generated microcopy and keyword clusters for "${topic}".`, 'success');
    } catch (err: any) {
      addNotification('Notice', err.message || 'Error generating quick tags', 'warning');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendToPostStudio = (caption: string) => {
    const allTags = result ? [...result.trendingHashtags, ...result.nicheHashtags].map(h => h.startsWith('#') ? h : `#${h}`).join(' ') : '';
    setPrefilledContent({
      title: topic,
      caption: `${caption}\n\n${allTags}`,
      platform,
      hashtags: result ? [...result.trendingHashtags, ...result.nicheHashtags] : [],
    });
    setCurrentView('create-post');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:text-purple-300 dark:bg-purple-950 dark:text-purple-400">
            Microcopy Module
          </span>
          <span className="text-xs text-zinc-400">• Tagging & Captions</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
          Captions & Hashtags
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Generate relevant hashtag clusters and short-form caption variations for your posts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input parameters */}
        <div className="lg:col-span-4 space-y-4">
          <form onSubmit={handleGenerate} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Topic or Post Focus *
              </label>
              <input
                id="input-quick-topic"
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. 5 AI tools that save 10 hours a week"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-purple-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Niche / Industry
              </label>
              <input
                id="input-quick-niche"
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. Productivity, Real Estate, Fitness"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-purple-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Platform
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['instagram', 'linkedin', 'twitter', 'tiktok'] as SocialPlatform[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlatform(p)}
                    className={`rounded-lg py-1.5 text-[11px] font-bold capitalize transition-all ${
                      platform === p 
                        ? 'bg-purple-800 text-white' 
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
                    }`}
                  >
                    {p === 'twitter' ? 'X' : p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Tone Style
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-purple-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              >
                <option value="Punchy & High Energy">Punchy & High Energy</option>
                <option value="Casual & Relatable">Casual & Relatable</option>
                <option value="Executive & Polished">Executive & Polished</option>
                <option value="Contrarian & Intriguing">Contrarian & Intriguing</option>
                <option value="Humorous & Relatable">Humorous & Relatable</option>
              </select>
            </div>

            <button
              id="btn-run-quick-agent"
              type="submit"
              disabled={isGenerating}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-800 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-950/30 hover:bg-purple-700 transition-all disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Formulating Microcopy...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  <span>Generate Quick Copy & Tags</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-8 space-y-4">
          {!result && !isGenerating && (
            <div className="flex h-full min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/20">
              <Hash className="h-10 w-10 text-purple-600 dark:text-purple-400 mb-2" />
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                Instant Hashtags & Captions
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
                Enter your topic on the left to extract viral hooks and copy-ready hashtag bundles.
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="flex h-full min-h-[350px] flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-600 border-t-transparent mb-3" />
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Clustering keyword hashtags & crafting hooks...</p>
            </div>
          )}

          {result && !isGenerating && (
            <div className="space-y-4">
              {/* Quick Captions */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
                  Tailored Captions ({result.captions.length})
                </h3>
                <div className="space-y-3">
                  {result.captions.map((cap, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-950/40">
                      <p className="text-xs text-zinc-800 dark:text-zinc-200 flex-1">{cap}</p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleCopy(cap, `quick-cap-${i}`)}
                          className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                        >
                          {copiedKey === `quick-cap-${i}` ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                          <span>{copiedKey === `quick-cap-${i}` ? 'Copied' : 'Copy'}</span>
                        </button>
                        <button
                          onClick={() => handleSendToPostStudio(cap)}
                          className="flex items-center gap-1 rounded-lg bg-purple-800 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-purple-700"
                        >
                          <span>Use in Post</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending vs Niche Hashtag Bundles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Trending */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                      <span>Trending Broad Tags</span>
                    </h4>
                    <button
                      onClick={() => handleCopy(result.trendingHashtags.join(' '), 'trending-all')}
                      className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 dark:text-purple-400 hover:underline"
                    >
                      {copiedKey === 'trending-all' ? 'Copied!' : 'Copy all'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.trendingHashtags.map((tag, idx) => (
                      <span
                        key={idx}
                        onClick={() => handleCopy(tag, `trend-${idx}`)}
                        className="cursor-pointer rounded-md border border-purple-200 bg-purple-50/50 px-2 py-0.5 text-[10px] font-medium text-purple-700 dark:border-purple-900/60 dark:bg-purple-950/40 dark:text-purple-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Niche */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                      <span>High-Intent Niche Tags</span>
                    </h4>
                    <button
                      onClick={() => handleCopy(result.nicheHashtags.join(' '), 'niche-all')}
                      className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 dark:text-purple-400 hover:underline"
                    >
                      {copiedKey === 'niche-all' ? 'Copied!' : 'Copy all'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.nicheHashtags.map((tag, idx) => (
                      <span
                        key={idx}
                        onClick={() => handleCopy(tag, `niche-${idx}`)}
                        className="cursor-pointer rounded-md border border-purple-200 bg-purple-50/50 px-2 py-0.5 text-[10px] font-medium text-purple-700 dark:border-purple-900/60 dark:bg-purple-950/40 dark:text-purple-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
