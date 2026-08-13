import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Wind, Sparkles } from 'lucide-react';

export default function BreathingExercise() {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState('Inhale'); // Inhale (4s), Hold (7s), Exhale (8s)
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    let timer = null;

    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 1) {
            return prev - 1;
          } else {
            // Transition to next phase
            if (phase === 'Inhale') {
              setPhase('Hold');
              return 7;
            } else if (phase === 'Hold') {
              setPhase('Exhale');
              return 8;
            } else if (phase === 'Exhale') {
              setPhase('Inhale');
              setCycles((c) => c + 1);
              return 4;
            }
            return 4;
          }
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isRunning, phase]);

  const handleReset = () => {
    setIsRunning(false);
    setPhase('Inhale');
    setTimeLeft(4);
    setCycles(0);
  };

  const getPhaseColor = () => {
    if (phase === 'Inhale') return '#14b8a6';
    if (phase === 'Hold') return '#6366f1';
    return '#8b5cf6';
  };

  return (
    <div className="glass-panel container-breathing" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
        <Wind size={24} color="var(--accent-teal)" />
        <h3 style={{ fontSize: '1.3rem', margin: 0 }}>4-7-8 Breathing Circle</h3>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '480px' }}>
        Inhale quietly through your nose for 4s, hold for 7s, and exhale slowly through your mouth for 8s to calm your parasympathetic system.
      </p>

      {/* Animated Visualizer Circle */}
      <div style={{
        position: 'relative',
        width: '220px',
        height: '220px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2rem'
      }}>
        {/* Breathing Inner Circle */}
        <div 
          className={isRunning ? "anim-breathe" : ""}
          style={{
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${getPhaseColor()}22 0%, ${getPhaseColor()}66 100%)`,
            border: `3px solid ${getPhaseColor()}`,
            boxShadow: `0 0 30px ${getPhaseColor()}55`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'border-color 0.5s ease'
          }}
        >
          <span style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {phase}
          </span>
          <span style={{ fontSize: '2.5rem', fontWeight: 800, color: getPhaseColor(), marginTop: '0.2rem' }}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        <span>Completed Cycles: <strong style={{ color: '#fff' }}>{cycles}</strong></span>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button 
          onClick={() => setIsRunning(!isRunning)}
          className={`btn ${isRunning ? 'btn-secondary' : 'btn-primary'}`}
          style={{ minWidth: '130px' }}
        >
          {isRunning ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Start Exercise</>}
        </button>

        <button 
          onClick={handleReset}
          className="btn btn-secondary"
        >
          <RotateCcw size={16} /> Reset
        </button>
      </div>

    </div>
  );
}
