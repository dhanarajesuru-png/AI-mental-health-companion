import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert, ArrowRight } from 'lucide-react';
import CryptoJS from 'crypto-js';

export default function PinLockModal({ onUnlock }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleDigit = (digit) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError(false);

      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  const verifyPin = (inputPin) => {
    const storedHashedPin = localStorage.getItem('auramind_app_pin_hash');
    const inputHash = CryptoJS.SHA256(inputPin).toString();

    if (inputHash === storedHashedPin) {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setPin(''), 500);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #091322 0%, #040914 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '1rem'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem 2rem',
        maxWidth: '380px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
      }}>
        
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
        }}>
          <Lock size={26} color="#fff" />
        </div>

        <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>AuraMind App Lock</h2>
        <p style={{ fontSize: '0.82rem', color: '#a78bfa', margin: '0.3rem 0 1.5rem 0', textAlign: 'center' }}>
          Enter your 4-digit PIN to access your private sanctuary
        </p>

        {/* PIN Indicators */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                border: `2px solid ${error ? '#ef4444' : '#8b5cf6'}`,
                background: pin.length > i ? (error ? '#ef4444' : '#8b5cf6') : 'transparent',
                transition: 'all 0.2s ease',
                boxShadow: pin.length > i ? `0 0 10px ${error ? '#ef4444' : '#8b5cf6'}` : 'none'
              }}
            />
          ))}
        </div>

        {error && (
          <div style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldAlert size={14} /> Incorrect Passcode. Try again.
          </div>
        )}

        {/* Number Keypad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem', width: '100%' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleDigit(num.toString())}
              className="btn btn-secondary"
              style={{
                height: '52px',
                fontSize: '1.25rem',
                fontWeight: 700,
                background: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleDelete}
            className="btn btn-secondary"
            style={{ height: '52px', fontSize: '0.85rem', background: 'rgba(255, 255, 255, 0.03)' }}
          >
            Delete
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="btn btn-secondary"
            style={{ height: '52px', fontSize: '1.25rem', fontWeight: 700, background: 'rgba(255, 255, 255, 0.05)' }}
          >
            0
          </button>
          <button
            disabled
            className="btn btn-secondary"
            style={{ height: '52px', opacity: 0.2 }}
          >
            <KeyRound size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
