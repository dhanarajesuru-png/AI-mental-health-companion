import React, { useState } from 'react';
import { Brain, ArrowRight, CheckCircle2, AlertCircle, RotateCcw, Save } from 'lucide-react';
import { COGNITIVE_DISTORTIONS } from '../data/clinicalKnowledge';
import { StorageService } from '../services/storageService';

export default function CBTThoughtReframer() {
  const [step, setStep] = useState(1);
  const [situation, setSituation] = useState('');
  const [negativeThought, setNegativeThought] = useState('');
  const [emotionScore, setEmotionScore] = useState(75);
  const [selectedDistortions, setSelectedDistortions] = useState([]);
  const [reframedThought, setReframedThought] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleDistortion = (id) => {
    if (selectedDistortions.includes(id)) {
      setSelectedDistortions(selectedDistortions.filter(d => d !== id));
    } else {
      setSelectedDistortions([...selectedDistortions, id]);
    }
  };

  const handleSave = () => {
    StorageService.saveCBTRecord({
      situation,
      negativeThought,
      emotionScore,
      distortions: selectedDistortions,
      reframedThought
    });
    setSavedSuccess(true);
  };

  const resetForm = () => {
    setStep(1);
    setSituation('');
    setNegativeThought('');
    setEmotionScore(75);
    setSelectedDistortions([]);
    setReframedThought('');
    setSavedSuccess(false);
  };

  return (
    <div className="glass-panel container-cbt-step" style={{ padding: '1.75rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-indigo) 0%, var(--accent-violet) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Brain size={22} color="#fff" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>CBT Thought Reframer Wizard</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Evidence-based 4-step Cognitive Behavioral Therapy exercise
            </p>
          </div>
        </div>

        {/* Step Indicator Pills */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[1, 2, 3, 4].map(s => (
            <div key={s} style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: step === s ? 'var(--accent-teal)' : step > s ? 'rgba(20, 184, 166, 0.25)' : 'rgba(255,255,255,0.08)',
              color: step === s ? '#fff' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 700
            }}>
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Situation & Thought */}
      {step === 1 && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
              Step 1: What situation triggered this distress?
            </label>
            <input 
              type="text"
              className="input-field"
              placeholder="e.g. Received a critical review on my work project"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
              What is the automatic negative thought going through your mind?
            </label>
            <textarea 
              rows={3}
              className="textarea-field"
              placeholder="e.g. 'I'm completely incompetent and everyone thinks I should be fired.'"
              value={negativeThought}
              onChange={(e) => setNegativeThought(e.target.value)}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <span>Initial Emotional Distress Intensity:</span>
              <strong style={{ color: 'var(--accent-amber)' }}>{emotionScore}%</strong>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              value={emotionScore}
              onChange={(e) => setEmotionScore(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-amber)' }}
            />
          </div>

          <button 
            disabled={!situation || !negativeThought}
            onClick={() => setStep(2)}
            className="btn btn-primary"
            style={{ alignSelf: 'flex-end', marginTop: '0.5rem' }}
          >
            Next: Identify Cognitive Distortions <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Step 2: Cognitive Distortion Selection */}
      {step === 2 && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
            Select any cognitive distortions that match your thought:
          </p>

          <div className="grid-2">
            {COGNITIVE_DISTORTIONS.map(cd => {
              const isSelected = selectedDistortions.includes(cd.id);
              return (
                <div 
                  key={cd.id}
                  onClick={() => toggleDistortion(cd.id)}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.04)',
                    border: isSelected ? '1px solid var(--accent-indigo)' : '1px solid var(--border-glass)',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '0.95rem', color: isSelected ? '#a5b4fc' : '#fff' }}>{cd.name}</strong>
                    {isSelected && <CheckCircle2 size={16} color="var(--accent-indigo)" />}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{cd.definition}</p>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <button onClick={() => setStep(1)} className="btn btn-secondary">Back</button>
            <button onClick={() => setStep(3)} className="btn btn-primary">
              Next: Formulate Balanced Reframe <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Formulate Reframe */}
      {step === 3 && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Original Negative Thought:</span>
            <p style={{ fontStyle: 'italic', margin: '0.2rem 0 0 0', color: '#fecdd3' }}>"{negativeThought}"</p>
          </div>

          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
              Draft your balanced, realistic reframed thought:
            </label>
            <textarea 
              rows={4}
              className="textarea-field"
              placeholder="e.g. 'Constructive feedback feels uncomfortable, but it does not mean I am incompetent. I can learn from this review while recognizing my past accomplishments.'"
              value={reframedThought}
              onChange={(e) => setReframedThought(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(2)} className="btn btn-secondary">Back</button>
            <button 
              disabled={!reframedThought}
              onClick={() => { handleSave(); setStep(4); }} 
              className="btn btn-primary"
            >
              Save & Complete Reframe <Save size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Summary & Confirmation */}
      {step === 4 && (
        <div className="fade-in" style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          <CheckCircle2 size={48} color="var(--accent-teal)" style={{ margin: '0 auto 1rem auto' }} />
          <h4 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>CBT Thought Record Complete!</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
            You've successfully identified cognitive distortions and constructed a balanced perspective.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button onClick={resetForm} className="btn btn-secondary">
              <RotateCcw size={16} /> Reframing Another Thought
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
