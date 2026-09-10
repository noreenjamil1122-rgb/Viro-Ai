import React from 'react';
import { 
  Bot, 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  Image as ImageIcon, 
  Video, 
  BarChart3, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Zap,
  Globe,
  Share2,
  Users,
  Star
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onOpenAuth: (mode?: 'login' | 'signup') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  const { setCurrentView } = useApp();
  const { isAuthenticated } = useAuth();

  const handleLaunch = () => {
    if (isAuthenticated) {
      setCurrentView('dashboard');
    } else {
      onOpenAuth('signup');
    }
  };

  const agentPillars = [
    {
      title: "Content Generation Agent",
      desc: "Engineered for high-converting social copy, short & long captions, hashtags, video hooks, and CTA strategies.",
      icon: Sparkles,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-700/20",
    },
    {
      title: "Image & Visual Studio",
      desc: "Produces brand-consistent marketing visuals with multi-aspect ratio rendering and visual style presets.",
      icon: ImageIcon,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-700/20",
    },
    {
      title: "Video & Reel Agent",
      desc: "Generates multi-scene video storyboards, voiceover narrations, on-screen text overlays, and dynamic reel previews.",
      icon: Video,
      color: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    },
    {
      title: "Competitor Intelligence Agent",
      desc: "Audits competitor profiles, content pillars, SWOT metrics, and uncovers gaps to beat market engagement benchmarks.",
      icon: TrendingUp,
      color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    {
      title: "Scheduling & Dispatch Queue",
      desc: "Visual multi-platform calendar with conflict detection, timezone optimization, and queue lifecycle management.",
      icon: Calendar,
      color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
    {
      title: "Analytics & ROI Agent",
      desc: "Translates impressions, engagement velocity, and saves into actionable, diagnostic AI growth recommendations.",
      icon: BarChart3,
      color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-purple-800 selection:text-white">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-800 text-white shadow-lg shadow-purple-950/30">
            <Bot className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">ViroAI</span>
          <span className="rounded-full border border-purple-700/30 bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold text-purple-400">
            Multi-Agent System
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenAuth('login')}
            className="text-xs font-semibold text-zinc-400 hover:text-white px-3 py-1.5 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={handleLaunch}
            className="flex items-center gap-1.5 rounded-lg bg-purple-800 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-950/20 hover:bg-purple-700 transition-all active:scale-98"
          >
            <span>Launch Platform</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-6xl px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3.5 py-1.5 text-xs text-zinc-300 backdrop-blur-xs mb-6">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>AI-Driven Multi-Agent Business Intelligence System</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl max-w-4xl mx-auto leading-tight">
          Your Intelligent Multi-Agent <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-cyan-400">
            Social Media Business Assistant
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base text-zinc-400 leading-relaxed">
          Orchestrate 7 specialized autonomous AI agents across content generation, visual production, video storyboards, competitor intelligence, scheduling, and analytics.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            id="btn-landing-cta"
            onClick={handleLaunch}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-purple-800 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-950/30 hover:bg-purple-700 transition-all active:scale-98"
          >
            <Sparkles className="h-4 w-4" />
            <span>Start Free with ViroAI</span>
          </button>
          <button
            onClick={() => {
              if (isAuthenticated) setCurrentView('dashboard');
              else onOpenAuth('login');
            }}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-6 py-3 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all"
          >
            <Bot className="h-4 w-4 text-purple-400" />
            <span>Explore Agent Hub</span>
          </button>
        </div>

        {/* Live Multi-Agent Interactive Preview Card */}
        <div className="mt-14 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 sm:p-6 shadow-2xl backdrop-blur-md text-left">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-rose-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-zinc-500">viroai-agent-mesh // active runtime</span>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
              ● All 7 Agents Synchronized
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <h4 className="text-xs font-bold text-white">Content Generation Agent</h4>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                "Formulated 4 multi-platform caption angles with 15 niche tags tailored to the brand voice tone."
              </p>
              <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-500">
                <span>Latency: 840ms</span>
                <span className="text-emerald-400 font-semibold">100% Validated</span>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white">Competitor Intel Agent</h4>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                "Audited top 3 rivals. Identified 38% whitespace in scientific educational carousels."
              </p>
              <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-500">
                <span>SWOT Analysis Ready</span>
                <span className="text-purple-400 font-semibold">+18% Advantage</span>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white">Scheduling & Dispatch</h4>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                "Dispatched across Instagram, LinkedIn, and X during peak engagement windows."
              </p>
              <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-500">
                <span>Auto-Queued</span>
                <span className="text-emerald-400 font-semibold">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Specialized Agent Pillars */}
      <section className="mx-auto max-w-6xl px-6 py-16 border-t border-zinc-900">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            A Complete Multi-Agent Operating System
          </h2>
          <p className="mt-3 text-sm text-zinc-400">
            Each agent has specialized domain capabilities, collaborating harmoniously to drive measurable business outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agentPillars.map((agent, i) => {
            const Icon = agent.icon;
            return (
              <div 
                key={i} 
                className="group rounded-2xl border border-zinc-800/90 bg-zinc-900/40 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900/70"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl border mb-4 ${agent.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{agent.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{agent.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Role-Based Access Showcase */}
      <section className="mx-auto max-w-6xl px-6 py-16 border-t border-zinc-900">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-white">Built for Every Growth Stage</h2>
          <p className="mt-2 text-xs text-zinc-400">Enforce enterprise-ready Row Level Security and role-based permissions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Tier 01</span>
            <h3 className="text-lg font-bold text-white mt-1">Basic User</h3>
            <p className="text-xs text-zinc-400 mt-2">Essential AI content generation, draft saving, and manual media upload.</p>
            <ul className="mt-4 space-y-2 text-xs text-zinc-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> AI Content & Hashtag Generator</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Manual Post Creation</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Basic Scheduling & Drafts</li>
            </ul>
          </div>

          <div className="rounded-2xl border-2 border-purple-700/80 bg-zinc-900/80 p-6 relative">
            <span className="absolute -top-2.5 right-4 rounded-full bg-purple-800 px-2.5 py-0.5 text-[9px] font-bold text-white">
              POPULAR
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Tier 02</span>
            <h3 className="text-lg font-bold text-white mt-1">Professional User</h3>
            <p className="text-xs text-zinc-400 mt-2">Full multi-agent suite, competitor intelligence, image/video studios, and analytics.</p>
            <ul className="mt-4 space-y-2 text-xs text-zinc-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-purple-400" /> All 7 Intelligent Agents</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-purple-400" /> Competitor SWOT Audits</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-purple-400" /> AI Image & Video Studio</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-purple-400" /> Advanced Analytics & Reports</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Tier 03</span>
            <h3 className="text-lg font-bold text-white mt-1">Admin User</h3>
            <p className="text-xs text-zinc-400 mt-2">Complete platform administration, user management, system telemetry, and SQL schema deployment.</p>
            <ul className="mt-4 space-y-2 text-xs text-zinc-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-purple-400" /> User Role Management</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-purple-400" /> System Health & Telemetry</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-purple-400" /> Supabase Schema Installer</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-purple-400" /> Error Logging & Audit Trails</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 text-center text-xs text-zinc-500">
        <p>© 2026 ViroAI - AI-Driven Multi-Agent Business Intelligence & Social Media System</p>
      </footer>
    </div>
  );
};
