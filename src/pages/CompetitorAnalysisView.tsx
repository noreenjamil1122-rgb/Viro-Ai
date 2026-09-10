import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Plus, 
  Trash2, 
  ExternalLink, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Target, 
  RefreshCw, 
  BarChart2, 
  Layers,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useApp } from '../context/AppContext';
import { aiService } from '../services/aiService';
import { Competitor, SocialPlatform } from '../types';

export const CompetitorAnalysisView: React.FC = () => {
  const { competitors, addCompetitor, deleteCompetitor, addNotification } = useApp();

  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(competitors[0] || null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);

  // New competitor form
  const [compName, setCompName] = useState('');
  const [compHandle, setCompHandle] = useState('');
  const [compUrl, setCompUrl] = useState('');
  const [compPlatform, setCompPlatform] = useState<SocialPlatform>('instagram');

  const handleAuditCompetitor = async (comp: Competitor) => {
    setIsAuditing(true);
    try {
      const res = await aiService.analyzeCompetitor({
        competitorName: comp.name,
        profileUrl: comp.profile_url || `https://${comp.platform}.com/${comp.handle}`,
        platform: comp.platform,
      });

      // Update competitor locally
      const updatedComp: Competitor = {
        ...comp,
        strengths: res.strengths || comp.strengths,
        weaknesses: res.weaknesses || comp.weaknesses,
        opportunities: res.opportunities || comp.opportunities,
        threats: res.threats || comp.threats,
        recommendations: res.recommendations || comp.recommendations,
        posting_frequency: res.posting_frequency || comp.posting_frequency,
      };

      setSelectedCompetitor(updatedComp);
      addNotification('Intelligence Audit Completed', `Extracted SWOT telemetry for ${comp.name}.`, 'success');
    } catch (err: any) {
      addNotification('Notice', err.message || 'Error auditing competitor', 'warning');
    } finally {
      setIsAuditing(false);
    }
  };

  const handleCreateCompetitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName.trim()) return;

    try {
      const newComp = await addCompetitor({
        name: compName,
        handle: compHandle || `@${compName.toLowerCase().replace(/\s+/g, '')}`,
        profile_url: compUrl || `https://${compPlatform}.com/${compName.toLowerCase()}`,
        platform: compPlatform,
        followers_count: 0,
        engagement_rate: 0,
        posting_frequency: '0 posts / day',
        top_hashtags: [],
        strengths: ['Pending AI intelligence audit'],
        weaknesses: ['Pending AI intelligence audit'],
        opportunities: ['Click "Run AI Intelligence Audit" to analyze'],
        threats: [],
        recommendations: ['Run autonomous agent audit to generate strategic recommendations.'],
      });

      setSelectedCompetitor(newComp);
      setShowAddModal(false);
      setCompName('');
      setCompHandle('');
      setCompUrl('');
      addNotification('Competitor Monitored', `Added ${newComp.name} to intelligence tracking.`, 'success');
    } catch (err: any) {
      addNotification('Error', 'Failed to add competitor', 'error');
    }
  };

  const benchmarkChartData = [
    { metric: 'Engagement Rate (%)', yourBrand: 5.8, competitor: selectedCompetitor?.engagement_rate || 3.4 },
    { metric: 'Weekly Saves / Post', yourBrand: 340, competitor: 180 },
    { metric: 'Comment Response (%)', yourBrand: 88, competitor: 32 },
  ];

  const pillarData = [
    { name: 'Product Features', value: 40, color: '#4F46E5' },
    { name: 'Founder / Behind Scenes', value: 25, color: '#06B6D4' },
    { name: 'Industry Memes', value: 20, color: '#F59E0B' },
    { name: 'Customer Testimonials', value: 15, color: '#10B981' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                Intelligence Module
              </span>
              <span className="text-xs text-zinc-400">• Competitor Benchmarks</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
              Competitor Analysis
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Audit competitor profile metrics, analyze SWOT positioning, and identify strategy gaps.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-purple-800 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition-all active:scale-98"
            >
              <Plus className="h-4 w-4" />
              <span>Add Competitor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Competitor Selector Row or Empty State */}
      {competitors.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/20">
          <Target className="h-10 w-10 mx-auto text-zinc-400 mb-2" />
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No competitors added yet.</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
            Add a competitor to begin analysis.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-purple-800 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Competitor</span>
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2.5 items-center">
            {competitors.map((comp) => (
              <div
                key={comp.id}
                onClick={() => setSelectedCompetitor(comp)}
                className={`cursor-pointer flex items-center gap-3 rounded-xl border p-2.5 transition-all ${
                  selectedCompetitor?.id === comp.id
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-xs dark:bg-emerald-950/30'
                    : 'border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60'
                }`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 text-xs">
                  {comp.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-900 dark:text-white">{comp.name}</p>
                  <p className="text-[10px] text-zinc-400">{comp.handle} • {comp.platform}</p>
                </div>
              </div>
            ))}
          </div>

          {selectedCompetitor && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main Intelligence Overview */}
              <div className="lg:col-span-8 space-y-6">
                {/* Top Metric Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
                    <span className="text-[10px] font-medium text-zinc-400 uppercase">Estimated Followers</span>
                    <p className="text-lg font-bold text-zinc-900 dark:text-white mt-0.5">
                      {selectedCompetitor.followers_count ? selectedCompetitor.followers_count.toLocaleString() : '—'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
                    <span className="text-[10px] font-medium text-zinc-400 uppercase">Engagement Benchmark</span>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {selectedCompetitor.engagement_rate ? `${selectedCompetitor.engagement_rate}%` : '—'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
                    <span className="text-[10px] font-medium text-zinc-400 uppercase">Publishing Cadence</span>
                    <p className="text-lg font-bold text-zinc-900 dark:text-white mt-0.5">
                      {selectedCompetitor.posting_frequency || '—'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
                    <span className="text-[10px] font-medium text-zinc-400 uppercase">Platform</span>
                    <p className="text-lg font-bold text-purple-700 dark:text-purple-300 dark:text-purple-400 mt-0.5 capitalize">{selectedCompetitor.platform}</p>
                  </div>
                </div>

                {/* SWOT Intelligence Matrix */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-emerald-500" />
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                        AI SWOT Analysis for {selectedCompetitor.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleAuditCompetitor(selectedCompetitor)}
                      disabled={isAuditing}
                      className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${isAuditing ? 'animate-spin text-emerald-500' : ''}`} />
                      <span>Audit with Gemini</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Strengths */}
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/20 p-3.5 dark:bg-emerald-950/10">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Key Strengths</span>
                      </span>
                      <ul className="mt-2 space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                        {selectedCompetitor.strengths && selectedCompetitor.strengths.length > 0 ? (
                          selectedCompetitor.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-500 font-bold">•</span>
                              <span>{s}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-zinc-400 italic">No strengths recorded yet. Run audit to generate.</li>
                        )}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="rounded-xl border border-amber-500/20 bg-amber-50/20 p-3.5 dark:bg-amber-950/10">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>Identified Weaknesses</span>
                      </span>
                      <ul className="mt-2 space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                        {selectedCompetitor.weaknesses && selectedCompetitor.weaknesses.length > 0 ? (
                          selectedCompetitor.weaknesses.map((w, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-amber-500 font-bold">•</span>
                              <span>{w}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-zinc-400 italic">No weaknesses recorded yet. Run audit to generate.</li>
                        )}
                      </ul>
                    </div>

                    {/* Opportunities */}
                    <div className="rounded-xl border border-purple-700/20 bg-purple-50/20 p-3.5 dark:bg-purple-950/10">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 dark:text-purple-400 flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Whitespace Opportunities</span>
                      </span>
                      <ul className="mt-2 space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                        {selectedCompetitor.opportunities && selectedCompetitor.opportunities.length > 0 ? (
                          selectedCompetitor.opportunities.map((o, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                              <span>{o}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-zinc-400 italic">No opportunities recorded yet. Run audit to generate.</li>
                        )}
                      </ul>
                    </div>

                    {/* Threats */}
                    <div className="rounded-xl border border-rose-500/20 bg-rose-50/20 p-3.5 dark:bg-rose-950/10">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        <span>Market Threats</span>
                      </span>
                      <ul className="mt-2 space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                        {selectedCompetitor.threats && selectedCompetitor.threats.length > 0 ? (
                          selectedCompetitor.threats.map((t, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-rose-500 font-bold">•</span>
                              <span>{t}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-zinc-400 italic">No threats recorded yet. Run audit to generate.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Actionable Strategy Recommendations */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span>AI Strategic Playbook to Outperform {selectedCompetitor.name}</span>
                  </h3>
                  <div className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                    {selectedCompetitor.recommendations && selectedCompetitor.recommendations.length > 0 ? (
                      selectedCompetitor.recommendations.map((rec, i) => (
                        <div key={i} className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800 flex items-start gap-2.5">
                          <span className="flex h-5 w-5 items-center justify-center rounded bg-purple-800 text-[10px] font-bold text-white flex-shrink-0">
                            {i + 1}
                          </span>
                          <p className="leading-relaxed">{rec}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-zinc-400 italic py-2">Click "Audit with Gemini" above to generate strategic recommendations.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Comparative Charts & Tag Cloud */}
              <div className="lg:col-span-4 space-y-6">
                {/* Content Pillar Breakdown */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Their Content Pillars</h3>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Pillar breakdown of competitor's posts</p>

                  <div className="h-40 w-full my-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pillarData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="value">
                          {pillarData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                    {pillarData.map((p, i) => (
                      <div key={i} className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                          <span>{p.name}</span>
                        </span>
                        <span className="font-bold">{p.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Hashtags Monitored */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-2">Their Top Hashtags</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCompetitor.top_hashtags && selectedCompetitor.top_hashtags.length > 0 ? (
                      selectedCompetitor.top_hashtags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-zinc-400 italic">No hashtags logged yet</span>
                    )}
                  </div>
                </div>

                {/* Delete button */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      deleteCompetitor(selectedCompetitor.id);
                      setSelectedCompetitor(competitors.find(c => c.id !== selectedCompetitor.id) || null);
                      addNotification('Removed', `Stopped tracking ${selectedCompetitor.name}`, 'info');
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/50 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove Competitor</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Competitor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">Track New Competitor</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Enter the brand handle and platform to initialize the Intelligence Agent.
            </p>

            <form onSubmit={handleCreateCompetitor} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Buffer, Later, SproutSocial"
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Social Handle</label>
                <input
                  type="text"
                  placeholder="e.g. @brandhandle"
                  value={compHandle}
                  onChange={(e) => setCompHandle(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Platform</label>
                <select
                  value={compPlatform}
                  onChange={(e) => setCompPlatform(e.target.value as SocialPlatform)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                >
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">X / Twitter</option>
                  <option value="tiktok">TikTok</option>
                  <option value="facebook">Facebook</option>
                </select>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
                >
                  Add Competitor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
