import React, { useEffect, useState } from 'react';
import { Sparkles, ShieldCheck, Heart } from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onFinish(), 300);
          return 100;
        }
        return prev + 5;
      });
    }, 80);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'radial-gradient(circle at 50% 40%, rgba(56, 189, 248, 0.18) 0%, rgba(139, 92, 246, 0.12) 40%, #040711 80%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="fade-in" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        maxWidth: '480px'
      }}>
        
        {/* Animated App Logo Badge */}
        <div style={{
          position: 'relative',
          width: '90px',
          height: '90px',
          borderRadius: '28px',
          background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 50px rgba(56, 189, 248, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.3)',
          marginBottom: '1.75rem',
          animation: 'pulse 2s infinite ease-in-out'
        }}>
          <Sparkles size={48} color="#ffffff" />
        </div>

        {/* Brand Name */}
        <h1 style={{
          fontSize: '2.8rem',
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '-0.03em',
          margin: '0 0 0.4rem 0',
          background: 'linear-gradient(135deg, #ffffff 0%, #7dd3fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          AuraMind
        </h1>

        <p style={{
          fontSize: '0.92rem',
          color: '#94a3b8',
          margin: '0 0 2rem 0',
          lineHeight: 1.5
        }}>
          Clinically-Grounded Non-Clinical AI Wellness & Coping Engine
        </p>

        {/* Loading Progress Indicator Bar */}
        <div style={{
          width: '260px',
          height: '6px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '9999px',
          overflow: 'hidden',
          marginBottom: '0.85rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)',
            borderRadius: '9999px',
            boxShadow: '0 0 12px rgba(56, 189, 248, 0.8)',
            transition: 'width 0.08s linear'
          }} />
        </div>

        <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
          Initializing Safety Pipeline & RAG Knowledge Engine...
        </span>

      </div>
    </div>
  );
}
