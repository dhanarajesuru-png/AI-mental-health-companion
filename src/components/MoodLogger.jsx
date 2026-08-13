import React, { useState } from 'react';
import { Smile, Meh, Frown, AlertCircle, Heart, X, Tag, Plus, Check } from 'lucide-react';
import { StorageService } from '../services/storageService';

export default function MoodLogger({ isOpen, onClose, onLogSaved }) {
  if (!isOpen) return null;

  const [valence, setValence] = useState('good');
  const [score, setScore] = useState(7);
  const [selectedTags, setSelectedTags] = useState(['Work', 'Sleep']);
  const [note, setNote] = useState('');

  const moodTypes = [
    { id: 'great', label: 'Great', icon: '😄', color: '#10b981' },
    { id: 'good', label: 'Good', icon: '🙂', color: '#14b8a6' },
    { id: 'neutral', label: 'Neutral', icon: '😐', color: '#94a3b8' },
    { id: 'down', label: 'Down', icon: '😔', color: '#f59e0b' },
    { id: 'anxious', label: 'Anxious', icon: '😰', color: '#8b5cf6' },
    { id: 'crisis', label: 'Distressed', icon: '🆘', color: '#f43f5e' }
  ];

  const availableTags = ['Work', 'Family', 'Health', 'Sleep', 'Stress', 'Relationships', 'Exercise', 'Finances', 'Weather'];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = () => {
    const updated = StorageService.saveMoodLog({
      valence,
      score,
      tags: selectedTags,
      note
    });
    if (onLogSaved) onLogSaved(updated);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content fade-in">
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Smile size={22} color="var(--accent-teal)" />
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Daily Mood Check-In</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Valence Selector */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.6rem', color: 'var(--text-muted)' }}>
            How are you feeling overall right now?
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
            {moodTypes.map(m => {
              const isSelected = valence === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setValence(m.id)}
                  style={{
                    padding: '0.75rem 0.5rem',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? `${m.color}22` : 'rgba(255,255,255,0.04)',
                    border: isSelected ? `2px solid ${m.color}` : '1px solid var(--border-glass)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <span style={{ fontSize: '1.6rem' }}>{m.icon}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isSelected ? m.color : 'var(--text-main)' }}>
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Score Slider */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
            <span>Intensity Rating:</span>
            <strong style={{ color: 'var(--accent-teal)' }}>{score} / 10</strong>
          </div>
          <input 
            type="range"
            min="1"
            max="10"
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-teal)' }}
          />
        </div>

        {/* Tags */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
            Context & Triggers (Select all that apply):
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {availableTags.map(tag => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`badge ${isSelected ? 'badge-teal' : 'badge-secondary'}`}
                  style={{
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(20, 184, 166, 0.25)' : 'rgba(255,255,255,0.06)',
                    color: isSelected ? '#5eead4' : 'var(--text-muted)',
                    border: isSelected ? '1px solid var(--accent-teal)' : '1px solid var(--border-glass)',
                    padding: '0.35rem 0.65rem'
                  }}
                >
                  {isSelected ? <Check size={12} /> : <Plus size={12} />} {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Private Note */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
            Private Reflection (Encrypted locally):
          </label>
          <textarea 
            rows={3}
            className="textarea-field"
            placeholder="Write a brief reflection..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button onClick={handleSubmit} className="btn btn-primary">Save Check-In</button>
        </div>

      </div>
    </div>
  );
}
