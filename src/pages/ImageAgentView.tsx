import React, { useState } from 'react';
import { 
  ImageIcon, 
  Sparkles, 
  Download, 
  ArrowRight, 
  RefreshCw, 
  Sliders, 
  Layers, 
  Eye, 
  Check,
  Maximize2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { aiService } from '../services/aiService';
import { GeneratedImageResult } from '../types';

export const ImageAgentView: React.FC = () => {
  const { brandSettings, setCurrentView, setPrefilledContent, addNotification } = useApp();

  const [prompt, setPrompt] = useState('');
  const [product, setProduct] = useState(brandSettings.brand_name || '');
  const [style, setStyle] = useState('Minimalist Studio');
  const [aspectRatio, setAspectRatio] = useState('1:1');

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImageResult | null>(null);

  const [recentGallery, setRecentGallery] = useState<GeneratedImageResult[]>([]);

  const stylePresets = [
    { id: 'Minimalist Studio', desc: 'Clean, neutral background with soft shadows' },
    { id: 'Vibrant Tech', desc: 'Punchy energetic gradients & bold geometry' },
    { id: 'Editorial Luxury', desc: 'Sophisticated typography & magazine composition' },
    { id: 'Clean 3D Render', desc: 'Glossy glassmorphism, clay textures & isometric angles' },
    { id: 'Moody Cinematic', desc: 'Dramatic rim lighting & deep atmospheric tones' },
  ];

  const aspectRatios = [
    { id: '1:1', label: '1:1 Square', desc: 'Instagram Feed / LinkedIn' },
    { id: '4:5', label: '4:5 Portrait', desc: 'Instagram Mobile Feed' },
    { id: '16:9', label: '16:9 Wide', desc: 'Twitter / YouTube / Web' },
    { id: '9:16', label: '9:16 Vertical', desc: 'Stories / Reels / TikTok' },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const res = await aiService.generateImage({
        prompt,
        product,
        style,
        aspectRatio,
      });

      setCurrentImage(res);
      setRecentGallery(prev => [res, ...prev.slice(0, 5)]);
      addNotification('Graphic Generated', 'AI Visual Studio has rendered your commercial marketing graphic.', 'success');
    } catch (err: any) {
      addNotification('Image Notice', err.message || 'Error generating image', 'warning');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseInPost = (imgResult: GeneratedImageResult) => {
    setPrefilledContent({
      title: `${product} - Visual Showcase`,
      caption: `Take a look at what we've built with ${product}. Powered by autonomous AI agents.\n\n#AI #Innovation #Technology`,
      platform: 'instagram',
      suggestedMedia: imgResult.imageUrl,
    });
    setCurrentView('create-post');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:text-purple-300 dark:bg-purple-950 dark:text-purple-400">
            Visual Module
          </span>
          <span className="text-xs text-zinc-400">• Graphic Generation</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
          Image Generator
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Generate marketing imagery and social media visuals from structured prompts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration Form */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleGenerate} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5" />
              <span>Visual Prompt Engineering</span>
            </h2>

            {/* Prompt */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Visual Scene Prompt *
              </label>
              <textarea
                id="input-image-prompt"
                required
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the visual you want to generate (e.g. Modern product display with clean studio lighting)..."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-purple-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              />
            </div>

            {/* Product / Subject focus */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Product / Brand Focus (Optional)
              </label>
              <input
                id="input-image-product"
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Enter your product, service, or brand name"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-purple-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              />
            </div>

            {/* Visual Style Selection */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Visual Aesthetic Style
              </label>
              <div className="space-y-1.5">
                {stylePresets.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => setStyle(st.id)}
                    className={`cursor-pointer rounded-xl border p-2 text-xs transition-all ${
                      style === st.id
                        ? 'border-purple-700 bg-purple-50/40 text-purple-900 dark:bg-purple-950/30 dark:text-purple-200'
                        : 'border-zinc-200 bg-zinc-50/60 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-400 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{st.id}</span>
                      {style === st.id && <Check className="h-3.5 w-3.5 text-purple-700 dark:text-purple-300 dark:text-purple-400" />}
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-0.5">{st.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Aspect Ratio Picker */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Aspect Ratio Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                {aspectRatios.map((ar) => (
                  <button
                    key={ar.id}
                    type="button"
                    onClick={() => setAspectRatio(ar.id)}
                    className={`rounded-xl border p-2 text-left transition-all ${
                      aspectRatio === ar.id
                        ? 'border-purple-700 bg-purple-50/40 text-purple-900 dark:bg-purple-950/30 dark:text-purple-200'
                        : 'border-zinc-200 bg-zinc-50/60 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-400'
                    }`}
                  >
                    <p className="text-xs font-bold">{ar.label}</p>
                    <p className="text-[10px] text-zinc-400">{ar.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              id="btn-run-image-agent"
              type="submit"
              disabled={isGenerating}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-800 py-3 text-xs font-bold text-white shadow-md shadow-purple-950/30 hover:bg-purple-700 transition-all disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Synthesizing Studio Graphic...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Graphic Artwork</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Rendered Preview Card */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Commercial Render Preview</h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">High-fidelity generative visual asset</p>
              </div>
              {currentImage && (
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:text-purple-300 dark:bg-purple-950 dark:text-purple-400">
                    {currentImage.style} • {currentImage.aspectRatio}
                  </span>
                </div>
              )}
            </div>

            {/* Image Stage or Empty State */}
            <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950 dark:border-zinc-800 flex items-center justify-center min-h-[320px] max-h-[480px]">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-3 border-purple-700 border-t-transparent mb-3" />
                  <p className="text-xs font-bold text-white">Rendering pixel composition...</p>
                  <p className="text-[11px] text-zinc-400 mt-1">Applying lighting physics and tone balancing</p>
                </div>
              ) : currentImage ? (
                <img
                  src={currentImage.imageUrl}
                  alt={currentImage.prompt}
                  className="w-full object-contain max-h-[480px] transition-all hover:scale-101"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center bg-zinc-50 dark:bg-zinc-900/40 w-full h-full min-h-[320px]">
                  <ImageIcon className="h-12 w-12 text-zinc-400 mb-3" />
                  <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Create an AI image</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
                    Describe the visual you want to generate.
                  </p>
                </div>
              )}
            </div>

            {/* Prompt details & actions */}
            {currentImage && (
              <>
                <div className="mt-4 rounded-xl border border-zinc-100 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Generated From Prompt</p>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-0.5 leading-relaxed">
                    "{currentImage.prompt}"
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
                  <a
                    href={currentImage.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    download="viroai-artwork.jpg"
                    className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    <Download className="h-3.5 w-3.5 text-zinc-500" />
                    <span>Download High-Res</span>
                  </a>

                  <button
                    id="btn-use-image-in-post"
                    onClick={() => handleUseInPost(currentImage)}
                    className="flex items-center gap-1.5 rounded-xl bg-purple-800 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition-all active:scale-98"
                  >
                    <span>Use in Create Post Studio</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Recent Creations Gallery */}
          {recentGallery.length > 0 && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
                Studio Recent Render History
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {recentGallery.map((item, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setCurrentImage(item)}
                    className="group relative cursor-pointer overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 aspect-video sm:aspect-square"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.prompt}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                      <p className="text-[10px] text-white font-medium line-clamp-1">{item.style}</p>
                      <span className="text-[9px] text-purple-300">Click to preview</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
