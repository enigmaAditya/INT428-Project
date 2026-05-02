import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import Navbar from './components/Sidebar'; 
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import RiskAssessment from './components/ProfileForm';
import Portfolio from './components/Portfolio';
import AdvisorPage from './components/AdvisorPage';
import { InsightModal, TradeModal, NotificationModal, SystemStatusModal, ProfileModal } from './components/Modals';

function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isInsightOpen, setIsInsightOpen] = useState(false);
  const [isTradeOpen, setIsTradeOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSystemOpen, setIsSystemOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-neon-green/20 border-t-neon-green rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Risk Profile':
        return <RiskAssessment />;
      case 'Portfolio':
        return <Portfolio key={refreshKey} />;
      case 'AI Advisor':
        return <AdvisorPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="relative min-h-screen font-inter text-[#e3e1e9] bg-surface-dark">
      <div className="bg-mesh"></div>
      
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onInsightClick={() => setIsInsightOpen(true)}
        onTradeClick={() => setIsTradeOpen(true)}
        onNotifClick={() => setIsNotifOpen(true)}
        onSystemClick={() => setIsSystemOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
      />
      
      <div className="transition-all duration-500">
        {renderContent()}
      </div>
      
      {activeTab !== 'AI Advisor' && <Chat />}

      <InsightModal isOpen={isInsightOpen} onClose={() => setIsInsightOpen(false)} />
      <TradeModal isOpen={isTradeOpen} onClose={() => setIsTradeOpen(false)} onTradeComplete={() => setRefreshKey(prev => prev + 1)} />
      <NotificationModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      <SystemStatusModal isOpen={isSystemOpen} onClose={() => setIsSystemOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}

export default App;
