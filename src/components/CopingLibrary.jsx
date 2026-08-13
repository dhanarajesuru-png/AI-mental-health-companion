import React, { useState } from 'react';
import { Brain, Wind, Eye, ShieldCheck, Sparkles, Flame, Layers } from 'lucide-react';
import CBTThoughtReframer from './CBTThoughtReframer';
import BreathingExercise from './BreathingExercise';
import GroundingExercise from './GroundingExercise';
import DBTTippExercise from './DBTTippExercise';

export default function CopingLibrary({ initialTool }) {
  const [activeSubTab, setActiveSubTab] = useState(initialTool || 'cbt');

  const tools = [
    { id: 'cbt', label: 'CBT Reframer', icon: Brain },
    { id: 'breathing', label: '4-7-8 Breathing', icon: Wind },
    { id: 'grounding', label: '5-4-3-2-1 Grounding', icon: Eye },
    { id: 'dbt', label: 'DBT TIPP Protocol', icon: ShieldCheck }
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minHeight: 'calc(100vh - 180px)' }}>
      
      {/* Page Hero Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.06) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
          }}>
            <Layers size={22} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', margin: 0, color: '#ecfdf5' }}>Zen Mindfulness & Coping Studio Page</h2>
            <p style={{ fontSize: '0.82rem', color: '#a7f3d0', margin: 0 }}>
              "You cannot control the waves, but you can learn how to surf." — Evidence-based CBT & DBT toolkit.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.2)', padding: '0.4rem 0.85rem', borderRadius: '9999px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <Flame size={16} color="#34d399" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6ee7b7' }}>3-Day Ritual Streak</span>
        </div>
      </div>

      {/* Main Coping Container */}
      <div className="module-coping-container" style={{ padding: '1.75rem', flex: 1 }}>
        
        {/* Tool Navigation Switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {tools.map(tool => {
            const Icon = tool.icon;
            const isActive = activeSubTab === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveSubTab(tool.id)}
                className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  fontSize: '0.85rem',
                  background: isActive ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255,255,255,0.06)',
                  borderColor: isActive ? '#10b981' : 'rgba(255,255,255,0.1)'
                }}
              >
                <Icon size={16} />
                {tool.label}
              </button>
            );
          })}
        </div>

        {/* Active Tool Renderer */}
        {activeSubTab === 'cbt' && <CBTThoughtReframer />}
        {activeSubTab === 'breathing' && <BreathingExercise />}
        {activeSubTab === 'grounding' && <GroundingExercise />}
        {activeSubTab === 'dbt' && <DBTTippExercise />}

      </div>

    </div>
  );
}
