import React, { useState } from 'react';
import { Lock, Download, Trash2, ShieldCheck, X, Heart, Save, Key, KeyRound } from 'lucide-react';
import { StorageService } from '../services/storageService';
import CryptoJS from 'crypto-js';

export default function PrivacySettings({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [contact, setContact] = useState(() => StorageService.getTrustedContacts());
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('auramind_gemini_api_key') || '');
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinEnabled, setPinEnabled] = useState(() => !!localStorage.getItem('auramind_app_pin_hash'));
  const [pinSaved, setPinSaved] = useState(false);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('auramind_gemini_api_key', apiKey.trim());
    } else {
      localStorage.removeItem('auramind_gemini_api_key');
    }
    setApiKeySaved(true);
    setTimeout(() => setApiKeySaved(false), 2000);
  };

  const handleSavePin = () => {
    if (newPin.length === 4) {
      const hash = CryptoJS.SHA256(newPin).toString();
      localStorage.setItem('auramind_app_pin_hash', hash);
      setPinEnabled(true);
      setPinSaved(true);
      setNewPin('');
      setTimeout(() => setPinSaved(false), 2000);
    } else {
      alert("PIN must be exactly 4 digits.");
    }
  };

  const handleDisablePin = () => {
    localStorage.removeItem('auramind_app_pin_hash');
    setPinEnabled(false);
  };

  const handleSaveContact = () => {
    StorageService.saveTrustedContacts(contact);
    alert("Trusted contact updated successfully.");
  };

  const handleExport = () => {
    StorageService.exportData();
  };

  const handlePurge = () => {
    if (window.confirm("ARE YOU SURE? This will permanently delete all local mood logs, CBT records, and memory summaries.")) {
      StorageService.purgeAllData();
      window.location.reload();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content fade-in">
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Lock size={22} color="var(--accent-teal)" />
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Privacy & Encryption Controls</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>



        {/* Section 1: AI Model API Key (Gemini) */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
            <Key size={16} color="#38bdf8" />
            <h4 style={{ fontSize: '0.95rem', color: '#fff', margin: 0 }}>Google Gemini LLM API Key</h4>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 0.75rem 0' }}>
            (Optional) Provide your Gemini API key to enable live generative AI conversational responses. Leaves blank for local TF-IDF offline RAG mode.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="password"
              className="input-field"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{ flex: 1 }}
            />
            <button onClick={handleSaveApiKey} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
              <Save size={14} /> {apiKeySaved ? "Saved!" : "Save Key"}
            </button>
          </div>
        </div>

        {/* Section 2: App Passcode PIN Lock */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <KeyRound size={16} color="#c084fc" />
              <h4 style={{ fontSize: '0.95rem', color: '#fff', margin: 0 }}>App Passcode PIN Lock</h4>
            </div>
            {pinEnabled && (
              <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>PIN Lock Enabled</span>
            )}
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 0.75rem 0' }}>
            Protect your private mood entries with a 4-digit PIN lock every time you launch AuraMind.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input 
              type="password"
              className="input-field"
              placeholder="Set 4-digit PIN"
              maxLength={4}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
              style={{ width: '140px' }}
            />
            <button onClick={handleSavePin} className="btn btn-indigo" style={{ fontSize: '0.8rem' }}>
              <Save size={14} /> {pinSaved ? "PIN Saved!" : "Set PIN"}
            </button>
            {pinEnabled && (
              <button onClick={handleDisablePin} className="btn btn-danger" style={{ fontSize: '0.8rem' }}>
                Disable PIN
              </button>
            )}
          </div>
        </div>

        {/* Section 3: Trusted Emergency Contact */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
            <Heart size={16} color="var(--accent-teal)" />
            <h4 style={{ fontSize: '0.95rem', color: '#fff', margin: 0 }}>Trusted Crisis Contact</h4>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <input 
              type="text"
              className="input-field"
              placeholder="Contact Name & Role (e.g. Dr. Sarah Jenkins)"
              value={contact.name || ''}
              onChange={(e) => setContact({ ...contact, name: e.target.value })}
            />
            <input 
              type="text"
              className="input-field"
              placeholder="Phone Number"
              value={contact.phone || ''}
              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            />
          </div>

          <button onClick={handleSaveContact} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
            <Save size={14} /> Update Contact
          </button>
        </div>

        {/* Section 3: Data Ownership & Actions */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
          <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '0.6rem' }}>Data Ownership & Portability</h4>
          
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={handleExport} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
              <Download size={16} /> Export My Data (JSON)
            </button>
            <button onClick={handlePurge} className="btn btn-danger" style={{ fontSize: '0.85rem' }}>
              <Trash2 size={16} /> Emergency Purge All Data
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
