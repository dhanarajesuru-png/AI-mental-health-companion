import React from 'react';
import { PhoneCall, ShieldAlert, Heart, X, Wind, AlertTriangle, ExternalLink } from 'lucide-react';

export default function CrisisModal({ isOpen, onClose, safetyAudit, onStartBreathing }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content crisis-modal-content fade-in">
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ShieldAlert size={26} color="#f43f5e" />
            <div>
              <h3 style={{ fontSize: '1.35rem', margin: 0, color: '#ffe4e6' }}>India National Crisis & Emergency Escalation</h3>
              <span style={{ fontSize: '0.78rem', color: '#fecdd3' }}>Immediate 24/7 Support Resources in India</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fecdd3', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Safety Override Notice */}
        <div style={{ background: 'rgba(244, 63, 94, 0.15)', borderLeft: '4px solid #f43f5e', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.9rem', color: '#ffe4e6', margin: 0, fontWeight: 600 }}>
            {safetyAudit?.reason || "If you are experiencing severe emotional distress, self-harm thoughts, or an immediate medical crisis, please reach out to official Indian helplines right now. You are not alone."}
          </p>
        </div>

        {/* India Helplines List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          
          {/* Tele-MANAS */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '14px', padding: '1.25rem' }}>
            <h4 style={{ fontSize: '1.05rem', color: '#fff', margin: '0 0 0.25rem 0' }}>🇮🇳 Tele-MANAS (Govt. of India Mental Health Lifeline)</h4>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '0.85rem' }}>
              Free, confidential 24/7 tele-mental health support across India in 20+ regional languages.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <a href="tel:14416" className="btn btn-danger" style={{ textDecoration: 'none', padding: '0.55rem 1.1rem' }}>
                <PhoneCall size={16} /> Call 14416
              </a>
              <a href="tel:18008914416" className="btn btn-secondary" style={{ textDecoration: 'none', borderColor: '#f43f5e', color: '#fecdd3' }}>
                Call 1800-891-4416 (Toll Free)
              </a>
            </div>
          </div>

          {/* KIRAN Helpline */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '14px', padding: '1.25rem' }}>
            <h4 style={{ fontSize: '1.05rem', color: '#fff', margin: '0 0 0.25rem 0' }}>🇮🇳 KIRAN Mental Health Rehabilitation Helpline</h4>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '0.85rem' }}>
              Ministry of Social Justice & Empowerment helpline operating 24/7 in 13 Indian languages.
            </p>
            <a href="tel:18005990019" className="btn btn-danger" style={{ textDecoration: 'none', padding: '0.55rem 1.1rem' }}>
              <PhoneCall size={16} /> Call 1800-599-0019 (Toll Free)
            </a>
          </div>

          {/* Vandrevala Foundation & AASRA */}
          <div className="grid-2">
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '1.1rem' }}>
              <h5 style={{ fontSize: '0.95rem', color: '#fff', margin: '0 0 0.3rem 0' }}>Vandrevala Foundation</h5>
              <p style={{ fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '0.65rem' }}>24/7 free mental health counseling & crisis prevention.</p>
              <a href="tel:+919999666555" className="btn btn-secondary" style={{ textDecoration: 'none', fontSize: '0.8rem' }}>
                <PhoneCall size={14} /> +91 9999 666 555
              </a>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '1.1rem' }}>
              <h5 style={{ fontSize: '0.95rem', color: '#fff', margin: '0 0 0.3rem 0' }}>AASRA Helpline</h5>
              <p style={{ fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '0.65rem' }}>24/7 voluntary suicide prevention hotline.</p>
              <a href="tel:+919820466726" className="btn btn-secondary" style={{ textDecoration: 'none', fontSize: '0.8rem' }}>
                <PhoneCall size={14} /> +91 98204 66726
              </a>
            </div>
          </div>

          {/* National Indian Emergency Numbers */}
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '14px', padding: '1.25rem' }}>
            <h4 style={{ fontSize: '1rem', color: '#fb7185', margin: '0 0 0.4rem 0' }}>🚨 India National Emergency Numbers</h4>
            <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.85rem' }}>
              For immediate medical, police, or rescue emergencies in India:
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <a href="tel:112" className="btn btn-danger" style={{ textDecoration: 'none', fontSize: '0.82rem' }}>
                <PhoneCall size={14} /> National Emergency 112
              </a>
              <a href="tel:102" className="btn btn-secondary" style={{ textDecoration: 'none', fontSize: '0.82rem', borderColor: '#f43f5e' }}>
                Ambulance 102 / 108
              </a>
              <a href="tel:1091" className="btn btn-secondary" style={{ textDecoration: 'none', fontSize: '0.82rem' }}>
                Women Helpline 1091
              </a>
            </div>
          </div>

        </div>

        {/* De-escalation exercise launcher */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={() => { onClose(); onStartBreathing(); }} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            <Wind size={16} /> Open 4-7-8 Breathing Circle First
          </button>

          <button onClick={onClose} className="btn btn-secondary">
            Close Panel
          </button>
        </div>

      </div>
    </div>
  );
}
