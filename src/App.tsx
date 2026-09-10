import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';

// Pages
import { AuthPage } from './pages/AuthPage';
import { DashboardView } from './pages/DashboardView';
import { AgentsHubView } from './pages/AgentsHubView';
import { ContentAgentView } from './pages/ContentAgentView';
import { HashtagCaptionQuickView } from './pages/HashtagCaptionQuickView';
import { ImageAgentView } from './pages/ImageAgentView';
import { VideoAgentView } from './pages/VideoAgentView';
import { CompetitorAnalysisView } from './pages/CompetitorAnalysisView';
import { CreatePostWorkflowView } from './pages/CreatePostWorkflowView';
import { ManualUploadView } from './pages/ManualUploadView';
import { SchedulingCalendarView } from './pages/SchedulingCalendarView';
import { PostHistoryView } from './pages/PostHistoryView';
import { TemplatesView } from './pages/TemplatesView';
import { SocialIntegrationsView } from './pages/SocialIntegrationsView';
import { AnalyticsView } from './pages/AnalyticsView';
import { ReportsView } from './pages/ReportsView';
import { BrandSettingsView } from './pages/BrandSettingsView';
import { SettingsView } from './pages/SettingsView';
import { AdminDashboardView } from './pages/AdminDashboardView';
const AppContent: React.FC = () => {
  const { currentView, setCurrentView } = useApp();
  const { isAuthenticated } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If not authenticated, directly show the clean login / signup screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 selection:bg-purple-800 selection:text-white">
        <AuthPage onSuccess={() => setCurrentView('dashboard')} />
      </div>
    );
  }

  // Render view router for the application shell
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'agents':
        return <AgentsHubView />;
      case 'content-agent':
        return <ContentAgentView />;
      case 'quick-generator':
        return <HashtagCaptionQuickView />;
      case 'image-agent':
        return <ImageAgentView />;
      case 'video-agent':
        return <VideoAgentView />;
      case 'competitor-analysis':
        return <CompetitorAnalysisView />;
      case 'create-post':
        return <CreatePostWorkflowView />;
      case 'manual-upload':
        return <ManualUploadView />;
      case 'scheduler':
        return <SchedulingCalendarView />;
      case 'post-history':
        return <PostHistoryView />;
      case 'templates':
        return <TemplatesView />;
      case 'integrations':
        return <SocialIntegrationsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'reports':
        return <ReportsView />;
      case 'brand-settings':
        return <BrandSettingsView />;
      case 'settings':
        return <SettingsView />;
      case 'admin':
        return <AdminDashboardView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-100 font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100 selection:bg-purple-800 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <Navbar
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Dynamic Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {renderCurrentView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
