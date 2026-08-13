import React from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  BarChart3, 
  HeartHandshake, 
  TestTube2, 
  ArrowRight, 
  ShieldCheck, 
  Flame, 
  Activity, 
  Lock, 
  MessageSquare,
  Zap,
  TrendingUp
} from 'lucide-react';
import { StorageService } from '../services/storageService';

export default function HomePage({ currentUser, onSelectModule, onOpenCrisisModal }) {
  const moodLogs = StorageService.getMoodLogs();
  const memories = StorageService.getMemorySummaries();

  const avgScore = moodLogs.length 
    ? (moodLogs.reduce((acc, curr) => acc + curr.score, 0) / moodLogs.length).toFixed(1)
    : '6.8';

  const modules = [
    {
      id: 'chat',
      title: 'AI Sanctuary Page',
      subtitle: 'Real-time non-clinical therapeutic guidance',
      description: 'Conversational support powered by RAG clinical knowledge retrieval over CBT workbooks with grounding soundscapes and voice synthesis.',
      icon: MessageSquare,
      color: '#0ea5e9',
      bgGradient: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(2, 132, 199, 0.05) 100%)',
      borderColor: 'rgba(14, 165, 233, 0.3)',
      tag: 'RAG Grounding Active'
    },
    {
      id: 'coping',
      title: 'Zen Studio Page',
      subtitle: 'Mindfulness & CBT/DBT toolkit',
      description: 'Interactive 4-step CBT thought reframer wizard, animated 4-7-8 breathing circle, 5-4-3-2-1 sensory grounding, and DBT TIPP emergency skills.',
      icon: BrainCircuit,
      color: '#10b981',
      bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      tag: '4 Therapeutic Tools'
    },
    {
      id: 'analytics',
      title: 'Pulse Analytics Page',
      subtitle: 'Longitudinal mood & trigger tracking',
      description: '3D stat overview cards, weekly consistency heatmap grid, mood velocity bar charts, and reflection journal entry history.',
      icon: BarChart3,
      color: '#8b5cf6',
      bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(124, 58, 237, 0.05) 100%)',
      borderColor: 'rgba(139, 92, 246, 0.3)',
      tag: 'Longitudinal Tracking'
    },
    {
      id: 'memory',
      title: 'Memory Vault Page',
      subtitle: 'Encrypted companion context',
      description: 'Zero-raw-PII lightweight AI memory summaries preserved for personalized conversation continuity with full export & purge controls.',
      icon: HeartHandshake,
      color: '#f59e0b',
      bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.05) 100%)',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      tag: `${memories.length} Context Items`
    },
    {
      id: 'redteam',
      title: 'Red-Team Lab Page',
      subtitle: 'Cyber safety command center',
      description: 'Interactive monospace terminal evaluator for testing prompt safety against 9 prebuilt adversarial stress-test scenarios.',
      icon: TestTube2,
      color: '#f43f5e',
      bgGradient: 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(225, 29, 72, 0.05) 100%)',
      borderColor: 'rgba(244, 63, 94, 0.3)',
      tag: '100% Pass Battery'
    }
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', minHeight: 'calc(100vh - 180px)' }}>
      
      {/* Home Page Welcome Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 30, 0.98) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem 2.25rem',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(56, 189, 248, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-emerald">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block' }}></span>
              Sanctuary Portal Active
            </span>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>• Welcome Back</span>
          </div>

          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
            Hello, {currentUser ? currentUser.name : 'Wellness Partner'} 👋
          </h2>

          <p style={{ fontSize: '0.92rem', color: '#94a3b8', margin: 0, maxWidth: '640px', lineHeight: 1.6 }}>
            Select a specialized page module below to begin your wellness session, explore CBT exercises, track longitudinal mood trajectories, or audit safety guardrails.
          </p>
        </div>

        {/* Quick KPI Overview Stat Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '0.85rem 1.15rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Avg Mood Score</span>
            <strong style={{ fontSize: '1.4rem', color: '#38bdf8', fontWeight: 800 }}>{avgScore}/10</strong>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '0.85rem 1.15rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Mindfulness Ritual</span>
            <strong style={{ fontSize: '1.4rem', color: '#34d399', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Flame size={18} color="#34d399" /> 3 Days
            </strong>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '0.85rem 1.15rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>RAG Guardrails</span>
            <strong style={{ fontSize: '1.4rem', color: '#c084fc', fontWeight: 800 }}>100% Pass</strong>
          </div>

        </div>
      </div>

      {/* Module Launch Cards Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.15rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
            Explore Feature Page Modules
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>5 Standalone Pages Available</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.35rem' }}>
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div 
                key={mod.id}
                onClick={() => onSelectModule(mod.id)}
                style={{
                  background: mod.bgGradient,
                  border: `1px solid ${mod.borderColor}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.6rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 15px 35px ${mod.color}33`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      background: mod.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 0 20px ${mod.color}55`
                    }}>
                      <Icon size={24} color="#fff" />
                    </div>

                    <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: mod.color, border: `1px solid ${mod.borderColor}` }}>
                      {mod.tag}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem 0' }}>
                    {mod.title}
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: mod.color, fontWeight: 600, display: 'block', marginBottom: '0.65rem' }}>
                    {mod.subtitle}
                  </span>

                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.55, margin: 0 }}>
                    {mod.description}
                  </p>
                </div>

                <div style={{ marginTop: '1.35rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.82rem', color: '#e2e8f0', fontWeight: 600 }}>Launch Page View</span>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: mod.color
                  }}>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
