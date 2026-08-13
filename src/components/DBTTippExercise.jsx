import React, { useState, useEffect } from 'react';
import { Thermometer, Activity, Wind, Zap, CheckCircle2, ArrowRight, RotateCcw, Play, Pause } from 'lucide-react';

export default function DBTTippExercise() {
  const [activeStep, setActiveStep] = useState(0); // 0: T, 1: I, 2: P, 3: P
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [muscleIndex, setMuscleIndex] = useState(0);

  const steps = [
    {
      id: 'temperature',
      letter: 'T',
      name: 'Temperature (Cold Water Dive Reflex)',
      color: '#38bdf8',
      duration: 30,
      description: 'Splash cold water on your face, submerge your cheeks in a bowl of cool water, or hold an ice pack wrapped in a cloth against your eyes and cheeks for 30 seconds while leaning forward.',
      mechanism: 'Triggers the mammalian dive reflex: instantly activates vagal nerve stimulation and rapidly slows your heart rate during extreme panic spikes.'
    },
    {
      id: 'exercise',
      letter: 'I',
      name: 'Intense Exercise (Adrenaline Burnout)',
      color: '#f43f5e',
      duration: 60,
      description: 'Engage in 1 minute of intense body weight movement (jumping jacks, high knees, fast stairs, or quick push-ups) to match your body’s stress response.',
      mechanism: 'Expends high fight-or-flight adrenaline, burning off sympathetic nervous system surge so your body can shift back into baseline balance.'
    },
    {
      id: 'paced-breathing',
      letter: 'P',
      name: 'Paced Breathing (Parasympathetic Slowdown)',
      color: '#a855f7',
      duration: 120,
      description: 'Breathe deeply into your abdomen for 4 seconds, then exhale slowly through pursed lips for 7-8 seconds.',
      mechanism: 'Exhalations longer than inhalations stimulate the parasympathetic brake on your heart rate, reducing physical anxiety symptoms.'
    },
    {
      id: 'paired-relaxation',
      letter: 'P',
      name: 'Paired Muscle Relaxation',
      color: '#f59e0b',
      duration: 90,
      description: 'Systematically tense each muscle group firmly for 5 seconds while inhaling, then release completely while exhaling and whispering "Relax".',
      mechanism: 'Releases chronic motor tension and teaches your brain to recognize the contrast between somatic contraction and complete rest.'
    }
  ];

  const currentStep = steps[activeStep];

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleStepChange = (index) => {
    setActiveStep(index);
    setTimerSeconds(steps[index].duration);
    setIsTimerRunning(false);
    setMuscleIndex(0);
  };

  const muscleGroups = [
    { part: "Hands & Arms", instruction: "Clench both fists tightly into balls and pull wrists back towards shoulders." },
    { part: "Shoulders & Neck", instruction: "Raise your shoulders high up toward your ears and pull head back slightly." },
    { part: "Face & Jaw", instruction: "Scrunch up your eyes, nose, and forehead tight; bite jaw gently together." },
    { part: "Abdomen & Core", instruction: "Tense your abdominal muscles firmly as if bracing for impact." },
    { part: "Legs & Feet", instruction: "Curl your toes downward, squeeze thighs together, and flex calves tight." }
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Step Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {steps.map((step, idx) => {
          const isActive = activeStep === idx;
          return (
            <button
              key={step.id}
              onClick={() => handleStepChange(idx)}
              className="btn"
              style={{
                flex: 1,
                minWidth: '130px',
                background: isActive ? `${step.color}22` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isActive ? step.color : 'rgba(255,255,255,0.1)'}`,
                color: isActive ? step.color : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontWeight: isActive ? 700 : 500
              }}
            >
              <span style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: step.color,
                color: '#000',
                fontSize: '0.8rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {step.letter}
              </span>
              <span style={{ fontSize: '0.82rem' }}>{step.id.split('-')[0].toUpperCase()}</span>
            </button>
          );
        })}
      </div>

      {/* Main Active Card */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${currentStep.color}44`,
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        boxShadow: `0 0 30px ${currentStep.color}15`
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: currentStep.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              DBT TIPP Skill • Step {activeStep + 1} of 4
            </span>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', margin: '0.2rem 0 0 0' }}>
              {currentStep.name}
            </h3>
          </div>

          {/* Interactive Timer Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 1rem', borderRadius: '9999px', border: `1px solid ${currentStep.color}33` }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'monospace', color: currentStep.color }}>
              00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
            </span>
            
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              style={{ background: currentStep.color, border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#000' }}
            >
              {isTimerRunning ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: '2px' }} />}
            </button>

            <button
              onClick={() => { setTimerSeconds(currentStep.duration); setIsTimerRunning(false); }}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        <p style={{ fontSize: '0.92rem', color: '#e2e8f0', lineHeight: '1.6', margin: 0 }}>
          {currentStep.description}
        </p>

        {/* Dynamic Interactive Extra per Step */}
        {activeStep === 3 && (
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <strong style={{ fontSize: '0.9rem', color: '#fbbf24' }}>
                Target Muscle Group ({muscleIndex + 1}/{muscleGroups.length}): {muscleGroups[muscleIndex].part}
              </strong>
              <button
                onClick={() => setMuscleIndex((muscleIndex + 1) % muscleGroups.length)}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
              >
                Next Group <ArrowRight size={12} />
              </button>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#fef3c7', margin: 0 }}>
              "{muscleGroups[muscleIndex].instruction}"
            </p>
          </div>
        )}

        {/* Clinical Mechanism Footer */}
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-md)', borderLeft: `3px solid ${currentStep.color}` }}>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>CLINICAL MECHANISM:</span>
          <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: '0.2rem 0 0 0' }}>
            {currentStep.mechanism}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <button
            disabled={activeStep === 0}
            onClick={() => handleStepChange(activeStep - 1)}
            className="btn btn-secondary"
            style={{ opacity: activeStep === 0 ? 0.4 : 1 }}
          >
            Previous Step
          </button>

          {activeStep < 3 ? (
            <button
              onClick={() => handleStepChange(activeStep + 1)}
              className="btn btn-primary"
              style={{ background: currentStep.color, color: '#000', fontWeight: 700 }}
            >
              Next Step: {steps[activeStep + 1].letter} <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => handleStepChange(0)}
              className="btn btn-primary"
              style={{ background: '#10b981', color: '#fff', fontWeight: 700 }}
            >
              <CheckCircle2 size={16} /> Protocol Complete
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
