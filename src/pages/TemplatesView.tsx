import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  Tag, 
  Check, 
  Plus, 
  Copy,
  Layers,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Template } from '../types';

export const TemplatesView: React.FC = () => {
  const { templates, setPrefilledContent, setCurrentView, addNotification } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Product Launch', 'Educational / Tips', 'Promotional & Sales', 'Event & Webinar'];

  const filteredTemplates = templates.filter(t => {
    if (selectedCategory !== 'All' && t.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.caption_template.toLowerCase().includes(q);
    }
    return true;
  });

  const handleUseTemplate = (tpl: Template) => {
    const hashtags = tpl.suggested_hashtags || tpl.default_hashtags || [];
    const platforms = tpl.default_platforms || tpl.platforms || ['instagram'];
    setPrefilledContent({
      title: tpl.title,
      caption: `${tpl.caption_template}\n\n${hashtags.join(' ')}`,
      platform: platforms[0] || 'instagram',
      hashtags: hashtags,
    });
    addNotification('Template Loaded', `Applied "${tpl.title}" template into Post Studio.`, 'success');
    setCurrentView('create-post');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:text-purple-300 dark:bg-purple-950 dark:text-purple-400">
            Templates Module
          </span>
          <span className="text-xs text-zinc-400">• Post Frameworks</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
          Templates
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Select pre-structured post frameworks for announcements, education, and promotions.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-800 text-white shadow-xs'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-1.5 pl-8 pr-3 text-xs text-zinc-900 focus:border-purple-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/60"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="rounded bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  {tpl.category}
                </span>
                <span className="text-[10px] text-zinc-400 capitalize">
                  {tpl.platforms.join(', ')}
                </span>
              </div>

              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{tpl.title}</h3>
              
              <div className="mt-3 rounded-xl border border-zinc-100 bg-zinc-50/80 p-3 text-xs text-zinc-700 dark:border-zinc-800/80 dark:bg-zinc-950/40 dark:text-zinc-300 font-mono whitespace-pre-line max-h-36 overflow-y-auto leading-relaxed">
                {tpl.caption_template}
              </div>

              {/* Hashtags */}
              <div className="mt-3 flex flex-wrap gap-1">
                {tpl.default_hashtags?.map((tag) => (
                  <span key={tag} className="text-[10px] text-purple-700 dark:text-purple-300 dark:text-purple-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleUseTemplate(tpl)}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-purple-800 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition-all active:scale-98"
            >
              <span>Use This Template</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
