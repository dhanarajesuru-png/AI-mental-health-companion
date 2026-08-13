import React from 'react';
import { X, Printer, Shield, FileText, Calendar, Activity, Brain } from 'lucide-react';
import { StorageService } from '../services/storageService';

export default function TherapistReportModal({ isOpen, onClose, currentUser }) {
  if (!isOpen) return null;

  const logs = StorageService.getMoodLogs() || [];
  const reframings = StorageService.getReframings() || [];
  const userName = currentUser?.name || 'Anonymous Patient';
  const userEmail = currentUser?.email || 'N/A';
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const avgScore = logs.length 
    ? (logs.reduce((acc, curr) => acc + curr.score, 0) / logs.length).toFixed(1)
    : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div style={{
        background: '#0f172a',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '750px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden'
      }}>
        
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(139, 92, 246, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileText size={22} color="#c084fc" />
            <h3 style={{ fontSize: '1.2rem', margin: 0, color: '#fff' }}>Clinical Progress Summary Report</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={handlePrint} className="btn btn-indigo" style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}>
              <Printer size={15} /> Print / Save as PDF
            </button>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Content Area */}
        <div id="printable-therapist-report" style={{ padding: '1.75rem', overflowY: 'auto', flex: 1, color: '#e2e8f0' }}>
          
          {/* Header Banner */}
          <div style={{ borderBottom: '2px solid rgba(139, 92, 246, 0.4)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#f3e8ff' }}>AURAMIND CLINICAL SUMMARY REPORT</h1>
                <p style={{ fontSize: '0.8rem', color: '#a78bfa', margin: '0.2rem 0 0 0' }}>
                  Self-Reported Longitudinal Mood Trajectory & CBT Tool Usage
                </p>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#94a3b8' }}>
                <div><strong>Date Generated:</strong> {currentDate}</div>
                <div><strong>Security ID:</strong> {currentUser?.id || 'usr_demo_01'}</div>
              </div>
            </div>
          </div>

          {/* Patient Overview Box */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div><strong>Patient Name:</strong> {userName}</div>
              <div><strong>Account Email:</strong> {userEmail}</div>
              <div><strong>Total Check-Ins:</strong> {logs.length} sessions</div>
              <div><strong>Average Mood Score:</strong> <span style={{ color: '#38bdf8', fontWeight: 700 }}>{avgScore} / 10</span></div>
            </div>
          </div>

          {/* Section 1: Mood Logs */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', color: '#c084fc', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Activity size={16} /> Recent Mood Logs & Affect Trajectory
            </h4>
            {logs.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No mood check-ins recorded yet.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <th style={{ padding: '0.5rem' }}>Date</th>
                    <th style={{ padding: '0.5rem' }}>Score</th>
                    <th style={{ padding: '0.5rem' }}>Valence</th>
                    <th style={{ padding: '0.5rem' }}>Triggers/Tags</th>
                    <th style={{ padding: '0.5rem' }}>User Reflection</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.slice(0, 8).map((l, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '0.5rem', color: '#cbd5e1' }}>{l.date}</td>
                      <td style={{ padding: '0.5rem', fontWeight: 700, color: l.score >= 6 ? '#34d399' : '#fb7185' }}>{l.score}/10</td>
                      <td style={{ padding: '0.5rem', textTransform: 'capitalize' }}>{l.valence}</td>
                      <td style={{ padding: '0.5rem' }}>{(l.tags || []).join(', ') || '-'}</td>
                      <td style={{ padding: '0.5rem', fontStyle: 'italic', color: '#94a3b8' }}>"{l.note || 'No note'}"</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Section 2: Cognitive Reframing History */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', color: '#c084fc', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Brain size={16} /> CBT Thought Reframing Logs
            </h4>
            {reframings.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No cognitive reframings completed yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {reframings.slice(0, 3).map((r, idx) => (
                  <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '0.82rem' }}>
                    <div><strong style={{ color: '#fb7185' }}>Automatic Thought:</strong> "{r.automaticThought}"</div>
                    <div><strong style={{ color: '#fbbf24' }}>Distortion Identified:</strong> {r.distortion || 'General'}</div>
                    <div><strong style={{ color: '#34d399' }}>Balanced Reframe:</strong> "{r.balancedThought}"</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Clinical Disclaimer */}
          <div style={{ background: 'rgba(59, 130, 246, 0.08)', padding: '0.85rem', borderRadius: '6px', border: '1px solid rgba(59, 130, 246, 0.2)', fontSize: '0.75rem', color: '#93c5fd' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginBottom: '0.2rem' }}>
              <Shield size={14} /> CLINICAL CONFIDENTIALITY NOTICE
            </div>
            This document contains self-reported wellness logs generated by AuraMind AI Companion. It is intended solely for clinical review between the user and their licensed mental health provider. AuraMind does not provide medical diagnoses.
          </div>

        </div>

      </div>
    </div>
  );
}
