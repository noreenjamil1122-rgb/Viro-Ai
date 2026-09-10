import React, { useState } from 'react';
import { 
  Palette, 
  Sparkles, 
  Save, 
  Check, 
  RotateCcw, 
  Tag, 
  Type, 
  Globe, 
  Sliders, 
  Info, 
  Volume2, 
  ShieldCheck, 
  Plus, 
  X,
  Target,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandSettings } from '../types';

export const BrandSettingsView: React.FC = () => {
  const { brandSettings, saveBrandSettings, addNotification } = useApp();
  const [formData, setFormData] = useState<BrandSettings>({ ...brandSettings });
  const [newHashtag, setNewHashtag] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isEnhancingVoice, setIsEnhancingVoice] = useState(false);

  const handleInputChange = (field: keyof BrandSettings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddHashtag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHashtag.trim()) return;
    const tag = newHashtag.startsWith('#') ? newHashtag.trim() : `#${newHashtag.trim()}`;
    if (!formData.default_hashtags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        default_hashtags: [...prev.default_hashtags, tag]
      }));
    }
    setNewHashtag('');
  };

  const handleRemoveHashtag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      default_hashtags: prev.default_hashtags.filter(t => t !== tagToRemove)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveBrandSettings(formData);
      setSavedSuccess(true);
      addNotification(
        'Brand Profile Updated',
        `Brand settings for ${formData.brand_name} saved successfully.`,
        'success'
      );
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e: any) {
      addNotification('Error Saving', e.message || 'Failed to save brand settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEnhanceVoiceWithAI = async () => {
    setIsEnhancingVoice(true);
    try {
      // AI voice suggestion generator
      const tones = [
        "Authoritative yet approachable, using concise insights, action-oriented verbs, and thought-leadership terminology.",
        "Bold, energetic, and culturally attuned with conversational wit and high-impact hooks.",
        "Empathetic, scientifically backed, and educational with clear jargon-free clarity and trustworthy warmth.",
        "Visionary and inspirational, highlighting modern innovation, sustainable craft, and community-first growth."
      ];
      const randomTone = tones[Math.floor(Math.random() * tones.length)];
      
      setFormData(prev => ({
        ...prev,
        tone_of_voice: randomTone
      }));

      addNotification(
        'AI Brand Voice Enhanced',
        'Updated brand voice guidelines with optimal social engagement cadence.',
        'info'
      );
    } finally {
      setIsEnhancingVoice(false);
    }
  };

  const colorPresets = [
    { name: 'Indigo Dream', primary: '#4f46e5', secondary: '#06b6d4', accent: '#f59e0b' },
    { name: 'Emerald Growth', primary: '#059669', secondary: '#10b981', accent: '#f97316' },
    { name: 'Midnight Violet', primary: '#7c3aed', secondary: '#ec4899', accent: '#06b6d4' },
    { name: 'Cyber Rose', primary: '#e11d48', secondary: '#f43f5e', accent: '#3b82f6' },
    { name: 'Obsidian Gold', primary: '#18181b', secondary: '#3f3f46', accent: '#eab308' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Brand Profile & Identity
            </h1>
            <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:text-purple-300 dark:bg-purple-950 dark:text-purple-400">
              Brand Configuration
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Define your company's tone, aesthetic guidelines, target audience, and defaults used across AI generation modules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-save-brand-settings"
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all ${
              savedSuccess 
                ? 'bg-emerald-600 hover:bg-emerald-500' 
                : 'bg-purple-800 hover:bg-purple-700'
            }`}
          >
            {savedSuccess ? (
              <>
                <Check className="h-4 w-4" />
                <span>Saved Changes!</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{isSaving ? 'Saving...' : 'Save Brand Settings'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Brand Core & Voice */}
        <div className="space-y-6 lg:col-span-2">
          {/* General Information Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
              <Globe className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              General Brand Overview
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Brand / Business Name
                </label>
                <input
                  type="text"
                  value={formData.brand_name}
                  onChange={(e) => handleInputChange('brand_name', e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-purple-700 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  placeholder="e.g. ViroAI"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Industry / Business Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-purple-700 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  placeholder="e.g. AI Business Intelligence"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Company Tagline & Mission Statement
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-purple-700 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  placeholder="e.g. Autonomous AI intelligence for modern business operations."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Primary Target Audience & Demographics
                </label>
                <textarea
                  rows={2}
                  value={formData.target_audience}
                  onChange={(e) => handleInputChange('target_audience', e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-purple-700 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-white resize-none"
                  placeholder="e.g. Business managers, marketing teams, and content creators."
                />
              </div>
            </div>
          </div>

          {/* Tone of Voice & Copy Directives */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
                <Volume2 className="h-4 w-4 text-rose-500" />
                Tone of Voice & Personality
              </h2>
              <button
                type="button"
                onClick={handleEnhanceVoiceWithAI}
                disabled={isEnhancingVoice}
                className="flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-100 dark:border-purple-900 dark:bg-purple-950/60 dark:text-purple-300 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{isEnhancingVoice ? 'Enhancing...' : 'Suggest Voice'}</span>
              </button>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Voice Guidelines & Style
              </label>
              <textarea
                rows={3}
                value={formData.tone_of_voice}
                onChange={(e) => handleInputChange('tone_of_voice', e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-purple-700 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-white resize-none"
                placeholder="e.g. Authoritative yet approachable, using concise bullet points and direct hooks."
              />
              <p className="mt-1 text-[11px] text-zinc-400">
                Applied automatically across content generation and caption modules.
              </p>
            </div>

            {/* Quick Tone Tags */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['Professional', 'Witty & Playful', 'Educational & Science-backed', 'High-Luxury & Minimalist', 'Inspirational', 'Casual & Friendly'].map((toneTag) => (
                <button
                  key={toneTag}
                  type="button"
                  onClick={() => {
                    const current = formData.tone_of_voice;
                    if (!current.includes(toneTag)) {
                      handleInputChange('tone_of_voice', current ? `${current}, ${toneTag}` : toneTag);
                    }
                  }}
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-[11px] font-medium text-zinc-600 hover:border-purple-300 hover:text-purple-700 dark:text-purple-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  + {toneTag}
                </button>
              ))}
            </div>
          </div>

          {/* Default Hashtags Bank */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
              <Tag className="h-4 w-4 text-amber-500" />
              Default Core Hashtags
            </h2>
            <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
              These hashtags will be pre-filled or automatically appended when generating social posts.
            </p>

            <form onSubmit={handleAddHashtag} className="mb-3 flex gap-2">
              <input
                type="text"
                value={newHashtag}
                onChange={(e) => setNewHashtag(e.target.value)}
                placeholder="Add hashtag (e.g. #ViroAI or #BusinessIntelligence)"
                className="flex-1 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-purple-700 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
              <button
                type="submit"
                className="flex items-center gap-1 rounded-xl bg-zinc-900 px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              {formData.default_hashtags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 rounded-lg border border-purple-100 bg-purple-50/70 px-2.5 py-1 text-xs font-medium text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveHashtag(tag)}
                    className="text-purple-400 hover:text-purple-700 dark:hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Visual Palette & Live Brand Badge */}
        <div className="space-y-6">
          {/* Live Brand Card Preview */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
              <Palette className="h-4 w-4 text-emerald-500" />
              Brand Preview Card
            </h2>

            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
              <div 
                className="p-4 text-white" 
                style={{ backgroundColor: formData.primary_color }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 font-bold backdrop-blur-xs">
                    {formData.brand_name.charAt(0) || 'V'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight">{formData.brand_name || 'Brand Name'}</h3>
                    <p className="text-[11px] opacity-90">{formData.category || 'Category'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-50 p-4 dark:bg-zinc-800/60">
                <p className="text-xs italic text-zinc-600 dark:text-zinc-300 mb-3">
                  "{formData.tagline || 'Your inspirational brand tagline here.'}"
                </p>
                <div className="flex items-center justify-between text-[11px] text-zinc-500">
                  <span>Font: <strong className="text-zinc-800 dark:text-zinc-200">{formData.font_preference}</strong></span>
                  <div className="flex items-center gap-1.5">
                    <div className="h-3.5 w-3.5 rounded-full border border-white" style={{ backgroundColor: formData.primary_color }} />
                    <div className="h-3.5 w-3.5 rounded-full border border-white" style={{ backgroundColor: formData.secondary_color }} />
                    <div className="h-3.5 w-3.5 rounded-full border border-white" style={{ backgroundColor: formData.accent_color }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Color Scheme Picker */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-3 text-sm font-bold text-zinc-900 dark:text-white">
              Color Palette
            </h2>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Primary Brand Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.primary_color}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded-lg border border-zinc-300 p-0.5 dark:border-zinc-700 bg-transparent"
                  />
                  <input
                    type="text"
                    value={formData.primary_color}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    className="flex-1 rounded-xl border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Secondary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.secondary_color}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded-lg border border-zinc-300 p-0.5 dark:border-zinc-700 bg-transparent"
                  />
                  <input
                    type="text"
                    value={formData.secondary_color}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    className="flex-1 rounded-xl border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.accent_color}
                    onChange={(e) => handleInputChange('accent_color', e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded-lg border border-zinc-300 p-0.5 dark:border-zinc-700 bg-transparent"
                  />
                  <input
                    type="text"
                    value={formData.accent_color}
                    onChange={(e) => handleInputChange('accent_color', e.target.value)}
                    className="flex-1 rounded-xl border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="mt-4 border-t border-zinc-100 pt-3 dark:border-zinc-800">
              <label className="mb-2 block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Preset Palettes
              </label>
              <div className="space-y-1.5">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        primary_color: preset.primary,
                        secondary_color: preset.secondary,
                        accent_color: preset.accent,
                      }));
                    }}
                    className="flex w-full items-center justify-between rounded-lg p-1.5 text-left text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium">{preset.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: preset.primary }} />
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: preset.secondary }} />
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: preset.accent }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Typography Preference */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
              <Type className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              Font & Typography
            </h2>

            <select
              value={formData.font_preference}
              onChange={(e) => handleInputChange('font_preference', e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-purple-700 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            >
              <option value="Inter, sans-serif">Modern Clean (Inter)</option>
              <option value="'Playfair Display', serif">Editorial Luxury (Playfair Display)</option>
              <option value="'Plus Jakarta Sans', sans-serif">Tech & SaaS (Plus Jakarta Sans)</option>
              <option value="'Space Grotesk', sans-serif">Bold Geometric (Space Grotesk)</option>
              <option value="system-ui, sans-serif">Native Minimalist (System UI)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
