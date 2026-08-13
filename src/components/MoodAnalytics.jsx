import React, { useState } from 'react';
import { BarChart3, TrendingUp, Tag, Plus, Activity, ShieldCheck, FileText } from 'lucide-react';
import { StorageService } from '../services/storageService';
import TherapistReportModal from './TherapistReportModal';
import GuidedJournal from './GuidedJournal';

export default function MoodAnalytics({ onOpenLogger, currentUser }) {
  const [logs, setLogs] = useState(() => StorageService.getMoodLogs());
  const [isReportOpen, setIsReportOpen] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 8) return '#34d399';
    if (score >= 6) return '#38bdf8';
    if (score >= 4) return '#fbbf24';
    return '#fb7185';
  };

  const avgScore = logs.length 
    ? (logs.reduce((acc, curr) => acc + curr.score, 0) / logs.length).toFixed(1)
    : 0;

  const tagCounts = {};
  logs.forEach(l => {
    (l.tags || []).forEach(t => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });

  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minHeight: 'calc(100vh - 180px)' }}>
      
      {/* Page Hero Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(99, 102, 241, 0.05) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
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
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)'
          }}>
            <Activity size={22} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', margin: 0, color: '#f3e8ff' }}>Pulse Analytics Dashboard Page</h2>
            <p style={{ fontSize: '0.82rem', color: '#a78bfa', margin: 0 }}>
              Longitudinal mood trajectory analysis and primary trigger correlation engine
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setIsReportOpen(true)} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            <FileText size={16} color="#c084fc" /> Export Therapist Report (PDF)
          </button>
          <button onClick={onOpenLogger} className="btn btn-indigo" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
            <Plus size={16} /> Log Today's Mood
          </button>
        </div>
      </div>

      <TherapistReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        currentUser={currentUser}
      />

      {/* Main Analytics Container */}
      <div className="module-analytics-container" style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Overview Stat Cards */}
        <div className="grid-3">
          
          <div className="analytics-kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: '#c084fc' }}>Average Mood Trajectory</span>
              <TrendingUp size={18} color="#38bdf8" />
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0.4rem 0 0 0', color: getScoreColor(avgScore) }}>
              {avgScore} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/ 10</span>
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
              Calculated across {logs.length} check-in sessions
            </p>
          </div>

          <div className="analytics-kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: '#c084fc' }}>Primary Stress Triggers</span>
              <Tag size={18} color="#818cf8" />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.75rem' }}>
              {sortedTags.slice(0, 4).map(([tag, count]) => (
                <span key={tag} className="badge badge-indigo" style={{ fontSize: '0.75rem' }}>
                  {tag} ({count})
                </span>
              ))}
              {!sortedTags.length && <span style={{ fontSize: '0.8rem', color: '#64748b' }}>No tags logged yet</span>}
            </div>
          </div>

          <div className="analytics-kpi-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#c084fc', marginBottom: '0.4rem' }}>Weekly Consistency</span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                const isLogged = idx < logs.length;
                return (
                  <div 
                    key={idx} 
                    className="heatmap-day-square"
                    style={{
                      background: isLogged ? '#8b5cf6' : 'rgba(255,255,255,0.06)',
                      color: isLogged ? '#fff' : '#64748b'
                    }}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Visual Mood Velocity Timeline */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={20} color="#818cf8" />
              <h4 style={{ fontSize: '1.1rem', margin: 0, color: '#fff' }}>Mood Velocity Timeline</h4>
            </div>
            <span className="badge badge-indigo">AES-256 Encrypted Storage</span>
          </div>

          {/* Bar Chart */}
          <div style={{ height: '190px', display: 'flex', alignItems: 'flex-end', gap: '1.2rem', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {logs.slice(0, 10).reverse().map((log, i) => {
              const heightPct = (log.score / 10) * 100;
              return (
                <div key={log.id || i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '0.75rem', color: getScoreColor(log.score), fontWeight: 700 }}>
                    {log.score}
                  </span>
                  <div style={{
                    width: '100%',
                    maxWidth: '36px',
                    height: `${heightPct}%`,
                    background: `linear-gradient(180deg, ${getScoreColor(log.score)} 0%, ${getScoreColor(log.score)}33 100%)`,
                    borderRadius: '8px 8px 0 0',
                    boxShadow: `0 0 15px ${getScoreColor(log.score)}44`,
                    transition: 'height 0.5s ease'
                  }} />
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    {log.date ? log.date.slice(5) : `Day ${i+1}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Journal History */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
          <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '1rem' }}>Reflection Journal Entries</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {logs.map((log) => (
              <div key={log.id} style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 'var(--radius-md)',
                padding: '0.9rem 1.15rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: getScoreColor(log.score) }}>
                      Score: {log.score}/10 ({log.valence})
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>• {log.date}</span>
                  </div>
                  {log.note && (
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.3rem 0 0 0' }}>
                      "{log.note}"
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {(log.tags || []).map(t => (
                    <span key={t} className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guided Journaling Module */}
        <GuidedJournal />

      </div>

    </div>
  );
}
