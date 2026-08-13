import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function DisclosureBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fade-in" style={{
      background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.05) 100%)',
      border: '1px solid rgba(245, 158, 11, 0.3)',
      borderRadius: 'var(--radius-md)',
      padding: '0.65rem 1rem',
      marginBottom: '1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.75rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <AlertCircle size={18} color="#fbbf24" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '0.82rem', color: '#fef3c7', lineHeight: 1.4 }}>
          <strong>Clinical Disclosure:</strong> AuraMind is an AI-powered conversational wellness companion. It is <em>not</em> a therapist, doctor, or licensed medical provider and cannot diagnose or treat clinical conditions. If you are in distress or crisis in India, call Tele-MANAS <strong>14416</strong> / KIRAN <strong>1800-599-0019</strong> or Emergency <strong>112</strong> immediately.
        </span>
      </div>

      <button 
        onClick={() => setDismissed(true)}
        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.2rem' }}
        title="Dismiss notice"
      >
        <X size={16} />
      </button>
    </div>
  );
}
