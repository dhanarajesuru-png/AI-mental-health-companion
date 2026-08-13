import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Lock, HeartHandshake, KeyRound, Mail, User, Eye, EyeOff, LogIn, UserPlus, ArrowRight } from 'lucide-react';
import { AuthService } from '../services/authService';

export default function LoginPage({ onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const result = await AuthService.login(email, password);
        onLoginSuccess(result.user);
      } else {
        const result = await AuthService.register(name, email, password);
        onLoginSuccess(result.user);
      }
    } catch (err) {
      setError(err.message || 'Authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'radial-gradient(circle at 15% 20%, rgba(56, 189, 248, 0.15) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 45%), #050814'
    }}>
      <div style={{
        maxWidth: '1050px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '2.5rem',
        alignItems: 'center'
      }}>
        
        {/* Left Side: Product Branding & Clinical Security Pillars */}
        <div className="fade-in" style={{ color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(14, 165, 233, 0.5)'
            }}>
              <Sparkles size={28} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>AuraMind</h1>
            </div>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '1.5rem', color: '#f1f5f9' }}>
            Your Non-Clinical AI Sanctuary & Evidence-Based Coping Partner
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', background: 'rgba(255,255,255,0.03)', padding: '0.85rem 1.15rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <ShieldCheck size={22} color="#34d399" />
              <div>
                <strong style={{ fontSize: '0.9rem', color: '#e2e8f0', display: 'block' }}>Dual-Layer Crisis Guardrails</strong>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Regex keyword matcher & semantic hopelessness classifier override</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', background: 'rgba(255,255,255,0.03)', padding: '0.85rem 1.15rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <HeartHandshake size={22} color="#38bdf8" />
              <div>
                <strong style={{ fontSize: '0.9rem', color: '#e2e8f0', display: 'block' }}>RAG Clinical Grounding</strong>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Vector similarity retrieval over CBT workbooks & 4-7-8 breathing</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', background: 'rgba(255,255,255,0.03)', padding: '0.85rem 1.15rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Lock size={22} color="#fbbf24" />
              <div>
                <strong style={{ fontSize: '0.9rem', color: '#e2e8f0', display: 'block' }}>AES-256 Encrypted Memory Vault</strong>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Zero raw PII storage with full user export and emergency purge control</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Dedicated Auth Card */}
        <div className="fade-in" style={{
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(9, 14, 28, 0.98) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '24px',
          padding: '2.25rem',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(14, 165, 233, 0.12)'
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 0.3rem 0', color: '#fff' }}>
              {mode === 'login' ? 'Welcome Back' : 'Create AuraMind Account'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
              {mode === 'login' ? 'Sign in to access your secure wellness sanctuary' : 'Start your personal mental health coping journey'}
            </p>
          </div>

          {/* Mode Tabs */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '0.25rem', marginBottom: '1.25rem' }}>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              style={{
                flex: 1,
                padding: '0.6rem',
                borderRadius: '10px',
                border: 'none',
                background: mode === 'login' ? '#0ea5e9' : 'transparent',
                color: mode === 'login' ? '#fff' : '#94a3b8',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.88rem',
                transition: 'all 0.2s ease'
              }}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); }}
              style={{
                flex: 1,
                padding: '0.6rem',
                borderRadius: '10px',
                border: 'none',
                background: mode === 'signup' ? '#0ea5e9' : 'transparent',
                color: mode === 'signup' ? '#fff' : '#94a3b8',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.88rem',
                transition: 'all 0.2s ease'
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ background: 'rgba(244, 63, 94, 0.15)', borderLeft: '4px solid #f43f5e', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.83rem', color: '#fecdd3' }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            
            {mode === 'signup' && (
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem', color: '#94a3b8' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="#64748b" style={{ position: 'absolute', left: '0.9rem', top: '0.85rem' }} />
                  <input 
                    type="text"
                    required
                    className="input-field"
                    style={{ paddingLeft: '2.6rem' }}
                    placeholder="e.g. Alex Johnson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem', color: '#94a3b8' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '0.9rem', top: '0.85rem' }} />
                <input 
                  type="email"
                  required
                  className="input-field"
                  style={{ paddingLeft: '2.6rem' }}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem', color: '#94a3b8' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '0.9rem', top: '0.85rem' }} />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field"
                  style={{ paddingLeft: '2.6rem', paddingRight: '2.6rem' }}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.9rem', top: '0.85rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem', fontSize: '0.95rem', background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' }}
            >
              {loading ? 'Connecting to Node.js Backend...' : mode === 'login' ? 'Sign In to Sanctuary' : 'Create Free Account'}
              <ArrowRight size={18} />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
