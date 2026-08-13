import React, { useState } from 'react';
import Header from './components/Header';
import DisclosureBanner from './components/DisclosureBanner';
import HomePage from './components/HomePage';
import ChatCompanion from './components/ChatCompanion';
import CopingLibrary from './components/CopingLibrary';
import MoodAnalytics from './components/MoodAnalytics';
import MemoryManager from './components/MemoryManager';
import RedTeamSandbox from './components/RedTeamSandbox';
import CrisisModal from './components/CrisisModal';
import MoodLogger from './components/MoodLogger';
import PrivacySettings from './components/PrivacySettings';
import LoginPage from './components/LoginPage';
import SplashScreen from './components/SplashScreen';
import PinLockModal from './components/PinLockModal';
import { AuthService } from './services/authService';

export default function App() {
  const [showSplash, setShowSplash] = useState(false); // Start directly on Login Page
  const [isPinLocked, setIsPinLocked] = useState(() => !!localStorage.getItem('auramind_app_pin_hash'));
  const [activeTab, setActiveTab] = useState('home');
  const [isCrisisOpen, setIsCrisisOpen] = useState(false);
  const [safetyAudit, setSafetyAudit] = useState(null);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isMoodLoggerOpen, setIsMoodLoggerOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => AuthService.getCurrentUser());
  const [copingInitialTool, setCopingInitialTool] = useState('cbt');

  const handleOpenCrisis = (auditData = null) => {
    setSafetyAudit(auditData);
    setIsCrisisOpen(true);
  };

  const handleLaunchTool = (toolName) => {
    setCopingInitialTool(toolName);
    setActiveTab('coping');
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActiveTab('home');
  };

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
  };

  // 1. Initial Animated Logo Splash Screen
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // 2. Passcode PIN Lock Overlay
  if (isPinLocked) {
    return <PinLockModal onUnlock={() => setIsPinLocked(false)} />;
  }

  // 3. Standalone Full-Page Login Screen for Unauthenticated Users
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // 4. Authenticated Workspace Dashboard
  return (
    <div className="app-container">
      {/* Header Navigation Bar */}
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCrisisModal={() => handleOpenCrisis(null)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Clinical Disclosure Banner */}
      <DisclosureBanner />

      {/* Main Dedicated Page Content */}
      <main style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <HomePage 
            currentUser={currentUser}
            onSelectModule={(tabId) => setActiveTab(tabId)}
            onOpenCrisisModal={() => handleOpenCrisis(null)}
          />
        )}

        {activeTab === 'chat' && (
          <ChatCompanion 
            onOpenCrisis={handleOpenCrisis}
            onLaunchTool={handleLaunchTool}
            onOpenMoodLogger={() => setIsMoodLoggerOpen(true)}
          />
        )}

        {activeTab === 'coping' && (
          <CopingLibrary initialTool={copingInitialTool} />
        )}

        {activeTab === 'analytics' && (
          <MoodAnalytics currentUser={currentUser} onOpenLogger={() => setIsMoodLoggerOpen(true)} />
        )}

        {activeTab === 'memory' && (
          <MemoryManager />
        )}

        {activeTab === 'redteam' && (
          <RedTeamSandbox />
        )}
      </main>

      {/* Modals & Overlays */}
      <CrisisModal 
        isOpen={isCrisisOpen}
        onClose={() => setIsCrisisOpen(false)}
        safetyAudit={safetyAudit}
        onStartBreathing={() => handleLaunchTool('breathing')}
      />

      <MoodLogger 
        isOpen={isMoodLoggerOpen}
        onClose={() => setIsMoodLoggerOpen(false)}
      />

      <PrivacySettings 
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
}
