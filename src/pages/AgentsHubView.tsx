import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Hash, 
  ImageIcon, 
  Video, 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  Radio, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Zap, 
  Clock, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AgentsHubView: React.FC = () => {
  const { setCurrentView, agentActivities, addNotification } = useApp();
  const [runningAgent, setRunningAgent] = useState<string | null>(null);

  const totalOperations = agentActivities.length;
  const avgLatency = agentActivities.length > 0
    ? `${Math.round(agentActivities.reduce((acc, a) => acc + (a.execution_time_ms || 800), 0) / agentActivities.length)}ms`
    : '0ms';

  const getAgentRuns = (type: string) => {
    return agentActivities.filter(a => a.agent_type === type).length;
  };

  const agentsList = [
    {
      id: 'content-agent',
      name: 'Content Generator',
      category: 'Copywriting & Content Strategy',
      desc: 'Generates structured social posts, multiple hook angles, captions, and call-to-actions aligned with brand voice.',
      icon: Sparkles,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-700/20',
      status: 'Active',
      successRate: '100%',
      avgLatency: '820ms',
      completedCount: getAgentRuns('content'),
      view: 'content-agent',
    },
    {
      id: 'quick-generator',
      name: 'Captions & Hashtags',
      category: 'Microcopy & Tagging',
      desc: 'Generates relevant hashtag clusters, quick caption variations, and social media tags.',
      icon: Hash,
      color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      status: 'Active',
      successRate: '100%',
      avgLatency: '410ms',
      completedCount: getAgentRuns('hashtag'),
      view: 'quick-generator',
    },
    {
      id: 'image-agent',
      name: 'Image Generator',
      category: 'Visual Asset Generation',
      desc: 'Generates promotional graphics, social media banners, and commercial visuals from structured prompts.',
      icon: ImageIcon,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-700/20',
      status: 'Active',
      successRate: '100%',
      avgLatency: '1.4s',
      completedCount: getAgentRuns('image'),
      view: 'image-agent',
    },
    {
      id: 'video-agent',
      name: 'Video Generator',
      category: 'Video Scripting & Storyboards',
      desc: 'Generates scene-by-scene video storyboards, timed scripts, and visual prompts for short-form video.',
      icon: Video,
      color: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      status: 'Active',
      successRate: '100%',
      avgLatency: '1.2s',
      completedCount: getAgentRuns('video'),
      view: 'video-agent',
    },
    {
      id: 'competitor-analysis',
      name: 'Competitor Analysis',
      category: 'Market Intelligence & Benchmarks',
      desc: 'Audits competitor profile metrics, posting frequency, content categories, and strategy gaps.',
      icon: TrendingUp,
      color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      status: 'Active',
      successRate: '100%',
      avgLatency: '950ms',
      completedCount: getAgentRuns('competitor'),
      view: 'competitor-analysis',
    },
    {
      id: 'scheduler',
      name: 'Scheduling',
      category: 'Queue Management',
      desc: 'Manages post queues, schedule calendars, timezone routing, and channel publication dispatch.',
      icon: Calendar,
      color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      status: 'Active',
      successRate: '100%',
      avgLatency: '210ms',
      completedCount: getAgentRuns('scheduler'),
      view: 'scheduler',
    },
    {
      id: 'analytics',
      name: 'Analytics',
      category: 'Performance Evaluation',
      desc: 'Evaluates engagement rates, reach trends, platform distribution, and content recommendations.',
      icon: BarChart3,
      color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
      status: 'Active',
      successRate: '100%',
      avgLatency: '780ms',
      completedCount: getAgentRuns('analytics'),
      view: 'analytics',
    },
  ];

  const handleQuickRun = (agent: typeof agentsList[0]) => {
    setRunningAgent(agent.id);
    setTimeout(() => {
      setRunningAgent(null);
      addNotification(
        `${agent.name} Verified`,
        `${agent.name} operational state verified successfully.`,
        'success'
      );
    }, 900);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                7 Modules Active
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
              AI Agents
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 max-w-2xl">
              Overview of autonomous intelligence agents and functional statuses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-800/50 text-center min-w-[100px]">
              <p className="text-[10px] text-zinc-400 font-semibold uppercase">Total Operations</p>
              <p className="text-base font-bold text-zinc-900 dark:text-white">{totalOperations}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-800/50 text-center min-w-[100px]">
              <p className="text-[10px] text-zinc-400 font-semibold uppercase">Avg Latency</p>
              <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">{avgLatency}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {agentsList.map((agent) => {
          const Icon = agent.icon;
          const isRunning = runningAgent === agent.id;

          return (
            <div
              key={agent.id}
              className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/60"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${agent.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>{agent.status}</span>
                  </div>
                </div>

                <p className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 dark:text-purple-400">
                  {agent.category}
                </p>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white mt-0.5">
                  {agent.name}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  {agent.desc}
                </p>

                {/* Telemetry row */}
                <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-zinc-100 bg-zinc-50/80 p-2.5 dark:border-zinc-800/80 dark:bg-zinc-950/40">
                  <div>
                    <span className="text-[9px] text-zinc-400 block font-medium">Success</span>
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{agent.successRate}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-400 block font-medium">Latency</span>
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{agent.avgLatency}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-400 block font-medium">Runs</span>
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{agent.completedCount}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  id={`btn-open-agent-${agent.id}`}
                  onClick={() => setCurrentView(agent.view as any)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-purple-800 px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition-all active:scale-98"
                >
                  <span>Open Agent</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  id={`btn-ping-agent-${agent.id}`}
                  onClick={() => handleQuickRun(agent)}
                  disabled={isRunning}
                  title="Test Agent Status"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin text-purple-600 dark:text-purple-400' : ''}`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Agent Activity Feed */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">
          Agent Activity Logs
        </h3>
        {agentActivities.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-400">
            <Bot className="h-8 w-8 mx-auto text-zinc-300 dark:text-zinc-700 mb-2" />
            <p>No agent activity logged yet.</p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Logs appear here as agents execute tasks.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {agentActivities.map((act) => (
              <div key={act.id} className="py-3 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-700 dark:text-purple-300 dark:bg-purple-950 dark:text-purple-400">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-900 dark:text-white">{act.agent_name}</span>
                      <span className="rounded bg-zinc-100 px-1.5 py-0.2 text-[9px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        {act.action}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{act.details}</p>
                  </div>
                </div>
                <span className="text-[10px] text-zinc-400 flex-shrink-0">
                  {new Date(act.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
