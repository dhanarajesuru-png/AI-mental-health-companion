import React from 'react';
import { 
  Sparkles, 
  Lock, 
  PhoneCall,
  UserCheck,
  LogOut,
  ChevronRight,
  Home
} from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onOpenCrisisModal, onOpenPrivacy, currentUser, onLogout }) {
  const tabsMap = {
    home: 'Home Page',
    chat: 'AI Sanctuary Page',
    coping: 'Zen Studio Page',
    analytics: 'Pulse Analytics Page',
    memory: 'Memory Vault Page',
    redteam: 'Red-Team Lab Page'
  };

  const currentLabel = tabsMap[activeTab] || 'Home Page';

  return (
    <header className="module-header">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand & Page Location Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div 
            onClick={() => setActiveTab('home')}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)',
              cursor: 'pointer'
            }}
            title="Return to Home Dashboard Page"
          >
            <Sparkles size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 
                onClick={() => setActiveTab('home')}
                style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#fff', cursor: 'pointer' }}
              >
                AuraMind
              </h1>
              <ChevronRight size={16} color="#64748b" />
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8' }}>
                {currentLabel}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
              Clinically-Grounded Non-Clinical AI Wellness & Coping Engine
            </p>
          </div>
        </div>

        {/* User Auth & Quick Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          
          {/* Prominent Direct Home Page Button */}
          <button 
            onClick={() => setActiveTab('home')}
            className={`btn ${activeTab === 'home' ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              padding: '0.55rem 0.95rem',
              fontSize: '0.85rem',
              background: activeTab === 'home' ? 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' : 'rgba(255,255,255,0.08)',
              borderColor: activeTab === 'home' ? '#0ea5e9' : 'rgba(255,255,255,0.15)'
            }}
            title="Go directly to Home Dashboard Page"
          >
            <Home size={16} />
            Home
          </button>

          {currentUser && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="badge badge-indigo" style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <UserCheck size={14} color="#38bdf8" /> {currentUser.name}
              </span>
              <button 
                onClick={onLogout}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.65rem', fontSize: '0.8rem' }}
                title="Log Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}

          <button 
            onClick={onOpenPrivacy}
            className="btn btn-secondary" 
            title="Privacy & Encryption Settings"
            style={{ padding: '0.55rem 0.85rem' }}
          >
            <Lock size={16} color="#94a3b8" />
            <span style={{ fontSize: '0.8rem' }}>Vault</span>
          </button>

          <button 
            onClick={onOpenCrisisModal}
            className="btn btn-danger"
            style={{ fontSize: '0.85rem', padding: '0.55rem 0.95rem' }}
          >
            <PhoneCall size={16} />
            Crisis 14416 / 112
          </button>
        </div>

      </div>
    </header>
  );
}
