import React, { useState } from 'react';
import { BookOpen, Sparkles, AlertCircle, Save, CheckCircle2 } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { COGNITIVE_DISTORTIONS } from '../data/clinicalKnowledge';

export default function GuidedJournal() {
  const [selectedTemplate, setSelectedTemplate] = useState('worry_dump');
  const [journalContent, setJournalContent] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const templates = [
    {
      id: 'worry_dump',
      name: 'Unfiltered Worry Dump',
      prompt: 'Write down everything weighing heavily on your mind right now without filtering or judging yourself...',
      color: '#38bdf8'
    },
    {
      id: 'gratitude_wins',
      name: 'Gratitude & Daily Highlights',
      prompt: '1. What are 3 small things that went well today?\n2. Who is someone you appreciate?\n3. What is one thing you did that you are proud of?',
      color: '#34d399'
    },
    {
      id: 'evening_reflection',
      name: 'Evening Wind-Down Reflection',
      prompt: 'What emotion was strongest today? How did you respond to stress, and what can you let go of before sleep?',
      color: '#c084fc'
    }
  ];

  const currentTemplate = templates.find(t => t.id === selectedTemplate);

  // Analyze text for potential cognitive distortion keywords
  const detectedDistortions = COGNITIVE_DISTORTIONS.filter(d => {
    const text = journalContent.toLowerCase();
    return text.includes(d.name.toLowerCase()) || 
           (d.id === 'all-or-nothing' && (text.includes('always') || text.includes('never') || text.includes('completely'))) ||
           (d.id === 'catastrophizing' && (text.includes('worst') || text.includes('ruined') || text.includes('disaster'))) ||
           (d.id === 'should-statements' && (text.includes('should') || text.includes('must') || text.includes('have to')));
  });

  const handleSaveJournal = () => {
    if (!journalContent.trim()) return;

    StorageService.saveMoodLog({
      score: selectedTemplate === 'gratitude_wins' ? 8 : 6,
      valence: selectedTemplate,
      note: `[Guided Journal - ${currentTemplate.name}]\n${journalContent}`,
      tags: ['guided-journal', selectedTemplate]
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="fade-in" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
      
      {/* Template Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <BookOpen size={20} color="#a78bfa" />
          <h4 style={{ fontSize: '1.1rem', margin: 0, color: '#fff' }}>Interactive Guided Reflection Journal</h4>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {templates.map(t => (
            <button
              key={t.id}
              onClick={() => { setSelectedTemplate(t.id); setJournalContent(''); }}
              className="btn"
              style={{
                fontSize: '0.78rem',
                background: selectedTemplate === t.id ? `${t.color}22` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${selectedTemplate === t.id ? t.color : 'rgba(255,255,255,0.1)'}`,
                color: selectedTemplate === t.id ? t.color : '#94a3b8'
              }}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Editor TextArea */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <textarea
          value={journalContent}
          onChange={(e) => setJournalContent(e.target.value)}
          placeholder={currentTemplate.prompt}
          rows={6}
          style={{
            width: '100%',
            background: 'rgba(15, 23, 42, 0.6)',
            border: `1px solid ${currentTemplate.color}44`,
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            color: '#f8fafc',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            resize: 'vertical',
            outline: 'none',
            fontFamily: 'inherit'
          }}
        />
      </div>

      {/* Real-time Distortion Detector Hints */}
      {detectedDistortions.length > 0 && (
        <div style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.82rem', color: '#fef08a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            <Sparkles size={15} color="#fbbf24" /> Potential Cognitive Pattern Detected:
          </div>
          {detectedDistortions.map(d => (
            <div key={d.id} style={{ marginTop: '0.2rem' }}>
              • <strong>{d.name}:</strong> <em>"{d.reframingQuestion}"</em>
            </div>
          ))}
        </div>
      )}

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
          {journalContent.trim().split(/\s+/).filter(Boolean).length} words
        </span>

        <button
          onClick={handleSaveJournal}
          disabled={!journalContent.trim()}
          className="btn btn-indigo"
          style={{ background: isSaved ? '#10b981' : currentTemplate.color, color: '#000', fontWeight: 700, opacity: journalContent.trim() ? 1 : 0.5 }}
        >
          {isSaved ? (
            <>
              <CheckCircle2 size={16} /> Journal Entry Saved!
            </>
          ) : (
            <>
              <Save size={16} /> Save Private Journal
            </>
          )}
        </button>
      </div>

    </div>
  );
}
