import React, { useState } from 'react';
import { LogIn, UserPlus, X, Mail, Lock, User, Eye, EyeOff, ShieldCheck, KeyRound } from 'lucide-react';
import { AuthService } from '../services/authService';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  if (!isOpen) return null;

  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fillDemoCredentials = () => {
    setEmail('user@auramind.org');
    setPassword('AuraMind2026!');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const result = await AuthService.login(email, password);
        onAuthSuccess(result.user);
        onClose();
      } else {
        const result = await AuthService.register(name, email, password);
        onAuthSuccess(result.user);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content fade-in" style={{ maxWidth: '480px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <KeyRound size={22} color="#0ea5e9" />
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Node.js User Authentication</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '0.25rem', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: 'var(--radius-sm)',
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
              padding: '0.55rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: mode === 'signup' ? '#0ea5e9' : 'transparent',
              color: mode === 'signup' ? '#fff' : '#94a3b8',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.88rem',
              transition: 'all 0.2s ease'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', borderLeft: '4px solid #f43f5e', padding: '0.65rem 1rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.82rem', color: '#fecdd3' }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {mode === 'signup' && (
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem', color: '#94a3b8' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '0.85rem' }} />
                <input 
                  type="text"
                  required
                  className="input-field"
                  style={{ paddingLeft: '2.4rem' }}
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
              <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '0.85rem' }} />
              <input 
                type="email"
                required
                className="input-field"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="user@auramind.org"
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
              <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '0.85rem' }} />
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                className="input-field"
                style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem' }}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.85rem', top: '0.85rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.8rem' }}
          >
            {loading ? 'Authenticating...' : mode === 'login' ? 'Log In to AuraMind' : 'Create Account'}
          </button>
        </form>

      </div>
    </div>
  );
}
