import React, { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import WorkflowCanvas from './components/WorkflowCanvas';
import TableView from './components/TableView';
import ThreeDView from './components/ThreeDView';
import DashboardView from './components/DashboardView';
import HeaderBar from './components/HeaderBar';
import CommandBar from './components/CommandBar';
import ViewSwitcher from './components/ViewSwitcher';
import LoadingScreen from './components/LoadingScreen';
import { useThemeStore } from './stores/themeStore';
import { useWorkflowStore } from './store/workflowStore';
import ProjectsView from './components/ProjectsView';

const App: React.FC = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { nodes, addNode } = useWorkflowStore();
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'canvas' | 'table' | '3d' | 'dashboard'>('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [selectedTrades, setSelectedTrades] = useState<Set<string>>(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showProjectsView, setShowProjectsView] = useState(true);

  React.useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandBarOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (showProjectsView) {
    return (
      <ProjectsView 
        onProjectSelect={(projectId) => {
          setCurrentProjectId(projectId);
          setShowProjectsView(false);
        }} 
      />
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-bolt-dark-bg' : 'bg-gray-100'}`}>
      <HeaderBar 
        onOpenCommandBar={() => setIsCommandBarOpen(true)}
        showProjectNav={true}
        onBackToProjects={() => setShowProjectsView(true)}
        projectId={currentProjectId}
      />
      <ViewSwitcher 
        currentView={currentView} 
        onViewChange={setCurrentView}
        nodes={nodes}
        selectedTrades={selectedTrades}
        onTradeToggle={tradeName => {
          setSelectedTrades(prev => {
            const newSet = new Set(prev);
            if (newSet.has(tradeName)) {
              newSet.delete(tradeName);
            } else {
              newSet.add(tradeName);
            }
            return newSet;
          });
        }}
        onClearTrades={() => setSelectedTrades(new Set())}
        isFilterOpen={isFilterOpen}
        onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
      />
      <ReactFlowProvider>
        <div className="flex h-[calc(100vh-7rem)]">
          <div className="flex-1">
            {currentView === 'dashboard' && <DashboardView />}
            {currentView === 'canvas' && (
              <WorkflowCanvas 
                selectedTrades={selectedTrades}
              />
            )}
            {currentView === 'table' && <TableView />}
            {currentView === '3d' && <ThreeDView />}
          </div>
        </div>
      </ReactFlowProvider>
      <CommandBar 
        isOpen={isCommandBarOpen} 
        onClose={() => setIsCommandBarOpen(false)} 
      />
    </div>
  );
};

export default App;