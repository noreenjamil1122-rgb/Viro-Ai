import React, { useState } from 'react';
import { 
  Video, 
  Sparkles, 
  Play, 
  Pause, 
  ArrowRight, 
  RefreshCw, 
  Sliders, 
  Volume2, 
  Type, 
  Eye, 
  Clock, 
  CheckCircle2,
  Film
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { aiService } from '../services/aiService';
import { GeneratedVideoResult } from '../types';

export const VideoAgentView: React.FC = () => {
  const { brandSettings, setCurrentView, setPrefilledContent, addNotification } = useApp();

  const [prompt, setPrompt] = useState('');
  const [product, setProduct] = useState(brandSettings.brand_name || '');
  const [purpose, setPurpose] = useState('Reel Hook / Viral Intro');
  const [duration, setDuration] = useState<number>(15);
  const [style, setStyle] = useState('Modern Fast-Cut');

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSceneIdx, setActiveSceneIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [videoResult, setVideoResult] = useState<GeneratedVideoResult | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const res = await aiService.generateVideo({
        prompt,
        product,
        purpose,
        duration,
        style,
      });

      setVideoResult(res);
      setActiveSceneIdx(0);
      addNotification('Video Storyboard Ready', `Synthesized ${res.scenes?.length || 4}-scene viral video storyboard.`, 'success');
    } catch (err: any) {
      addNotification('Notice', err.message || 'Error generating video plan', 'warning');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendToPostStudio = () => {
    if (!videoResult) return;
    const scriptSummary = videoResult.scenes?.map(s => `[${s.duration}] ${s.voiceover}`).join('\n\n');
    setPrefilledContent({
      title: `${videoResult.title} - Video Reel`,
      caption: `🎬 ${videoResult.title}\n\n${videoResult.scenes?.[0]?.onScreenText || ''}\n\n${scriptSummary}\n\n#VideoMarketing #Reels #ContentCreator`,
      platform: 'instagram',
      suggestedMedia: videoResult.thumbnailUrl,
    });
    setCurrentView('create-post');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:bg-rose-950 dark:text-rose-400">
            Video Module
          </span>
          <span className="text-xs text-zinc-400">• Scripting & Storyboards</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
          Video Generator
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Generate scene-by-scene video storyboards, timed scripts, and visual prompts for short-form video.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Video Config Form */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleGenerate} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5" />
              <span>Video Campaign Directives</span>
            </h2>

            {/* Prompt */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Video Topic / Hook Goal *
              </label>
              <textarea
                id="input-video-prompt"
                required
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter video concept or topic (e.g. 5 mistakes people make when choosing a solution)..."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-rose-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              />
            </div>

            {/* Product Focus */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Product / Brand Name (Optional)
              </label>
              <input
                id="input-video-product"
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Enter your product, service, or brand name"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-rose-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              />
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Video Archetype / Purpose
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-rose-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              >
                <option value="Reel Hook / Viral Intro">Reel Hook / Viral Intro (High Energy)</option>
                <option value="Product Spotlight">Product Feature Spotlight (Clear Value)</option>
                <option value="Problem / Solution Breakdown">Problem / Solution Breakdown (Educational)</option>
                <option value="Customer Case Study">Customer Case Study / Social Proof</option>
              </select>
            </div>

            {/* Duration & Style */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Target Duration
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {[15, 30, 60].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`rounded-lg py-1.5 text-xs font-bold transition-all ${
                        duration === d 
                          ? 'bg-rose-600 text-white' 
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {d}s
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Editing Pace
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-rose-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                >
                  <option value="Modern Fast-Cut">Fast-Cut Kinetic</option>
                  <option value="Smooth Cinematic">Smooth Cinematic</option>
                  <option value="Minimalist Clean">Minimalist Clean</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <button
              id="btn-run-video-agent"
              type="submit"
              disabled={isGenerating}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 py-3 text-xs font-bold text-white shadow-md shadow-rose-600/30 hover:bg-rose-500 transition-all disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Synthesizing Scene Blueprint...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Video Storyboard</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Interactive Storyboard & Stage */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
            {videoResult ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{videoResult.title}</h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {videoResult.duration}s Duration • {videoResult.scenes?.length || 4} Production Scenes
                    </p>
                  </div>

                  <button
                    onClick={handleSendToPostStudio}
                    className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-rose-500 transition-all"
                  >
                    <span>Send to Post Studio</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Simulated Reel Frame Canvas */}
                <div className="relative overflow-hidden rounded-xl bg-zinc-950 aspect-video flex items-center justify-center border border-zinc-800 p-6 text-center">
                  {videoResult.thumbnailUrl && (
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-30 blur-xs"
                      style={{ backgroundImage: `url(${videoResult.thumbnailUrl})` }}
                    />
                  )}
                  
                  <div className="relative z-10 max-w-md space-y-3">
                    <span className="rounded-full bg-rose-500/20 px-3 py-1 text-[10px] font-bold text-rose-400 border border-rose-500/40">
                      Scene {videoResult.scenes?.[activeSceneIdx]?.sceneNumber || 1} ({videoResult.scenes?.[activeSceneIdx]?.duration})
                    </span>
                    <h4 className="text-base sm:text-lg font-extrabold text-white tracking-tight drop-shadow-md">
                      "{videoResult.scenes?.[activeSceneIdx]?.onScreenText}"
                    </h4>
                    <div className="flex items-center justify-center gap-2 text-xs text-zinc-300 bg-zinc-900/80 px-3 py-1.5 rounded-lg backdrop-blur-md">
                      <Volume2 className="h-3.5 w-3.5 text-rose-400 flex-shrink-0" />
                      <span className="italic">VO: "{videoResult.scenes?.[activeSceneIdx]?.voiceover}"</span>
                    </div>
                  </div>

                  {/* Step scenes bottom bar */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-400">
                      {activeSceneIdx + 1} / {videoResult.scenes?.length}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {videoResult.scenes?.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveSceneIdx(idx)}
                          className={`h-2 rounded-full transition-all ${
                            activeSceneIdx === idx ? 'w-6 bg-rose-500' : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Scene-by-scene Breakdown Cards */}
                <div className="mt-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Production Scene Flow
                  </h4>

                  {videoResult.scenes?.map((scene, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveSceneIdx(idx)}
                      className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                        activeSceneIdx === idx
                          ? 'border-rose-500 bg-rose-50/30 dark:bg-rose-950/20'
                          : 'border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950/40 dark:hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded bg-rose-500 text-[10px] font-bold text-white">
                            {scene.sceneNumber}
                          </span>
                          <span>Timeline: {scene.duration}</span>
                        </span>
                        {activeSceneIdx === idx && (
                          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">Active Scene</span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-xs">
                        <div className="rounded-lg bg-white/70 p-2 dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800">
                          <span className="text-[10px] font-semibold text-zinc-400 uppercase block mb-0.5">🎬 Visual Action</span>
                          <p className="text-zinc-700 dark:text-zinc-300 leading-snug">{scene.visualDescription}</p>
                        </div>
                        <div className="rounded-lg bg-white/70 p-2 dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800">
                          <span className="text-[10px] font-semibold text-zinc-400 uppercase block mb-0.5">🎙️ Voiceover Script</span>
                          <p className="text-zinc-700 dark:text-zinc-300 leading-snug">"{scene.voiceover}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center bg-zinc-50 dark:bg-zinc-900/40 rounded-xl min-h-[360px]">
                <Film className="h-12 w-12 text-zinc-400 mb-3" />
                <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Generate video concept</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
                  Create AI video hooks, storyboard scenes, and social media video ideas.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
