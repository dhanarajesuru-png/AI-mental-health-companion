import React, { useState } from 'react';
import { Eye, Hand, Ear, Smile, CheckCircle, RotateCcw } from 'lucide-react';

export default function GroundingExercise() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      count: 5,
      sense: "SEE",
      icon: Eye,
      color: "#14b8a6",
      instruction: "Acknowledge 5 things you can see around you.",
      placeholder: "e.g., Desk lamp, window frame, blue notebook, wall clock, plant"
    },
    {
      count: 4,
      sense: "TOUCH / FEEL",
      icon: Hand,
      color: "#6366f1",
      instruction: "Acknowledge 4 things you can physically feel.",
      placeholder: "e.g., Feet on the floor, texture of shirt, cool room air, chair cushion"
    },
    {
      count: 3,
      sense: "HEAR",
      icon: Ear,
      color: "#8b5cf6",
      instruction: "Acknowledge 3 things you can hear right now.",
      placeholder: "e.g., Hum of refrigerator, distant traffic, your breath"
    },
    {
      count: 2,
      sense: "SMELL",
      icon: Smile,
      color: "#f59e0b",
      instruction: "Acknowledge 2 things you can smell (or memories of favorite scents).",
      placeholder: "e.g., Fresh coffee, essential oils, rain"
    },
    {
      count: 1,
      sense: "TASTE / AFFIRMATION",
      icon: CheckCircle,
      color: "#10b981",
      instruction: "Acknowledge 1 thing you can taste or speak 1 grounding affirmation.",
      placeholder: "e.g., 'I am safe in this present moment.'"
    }
  ];

  const current = steps[currentStep];
  const Icon = current ? current.icon : CheckCircle;

  return (
    <div className="glass-panel container-grounding" style={{ padding: '1.75rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', margin: 0 }}>5-4-3-2-1 Sensory Grounding</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            Re-anchor your awareness during anxiety or sensory overload
          </p>
        </div>

        <span className="badge badge-indigo">
          Step {currentStep + 1} of 5
        </span>
      </div>

      {currentStep < 5 ? (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            borderLeft: `4px solid ${current.color}`
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: `${current.color}22`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Icon size={26} color={current.color} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', color: current.color, margin: 0 }}>
                {current.count} Things You Can {current.sense}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                {current.instruction}
              </p>
            </div>
          </div>

          <textarea 
            rows={3}
            className="textarea-field"
            placeholder={current.placeholder}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button 
              disabled={currentStep === 0} 
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="btn btn-secondary"
            >
              Previous
            </button>

            <button 
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="btn btn-primary"
            >
              {currentStep === 4 ? 'Complete Exercise' : 'Next Step'}
            </button>
          </div>

        </div>
      ) : (
        <div className="fade-in" style={{ textAlign: 'center', padding: '2rem 0' }}>
          <CheckCircle size={52} color="var(--accent-emerald)" style={{ margin: '0 auto 1rem auto' }} />
          <h4 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Sensory Grounding Complete</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto 1.5rem auto' }}>
            Take a deep breath. Notice how your body feels anchored back in the physical space around you.
          </p>

          <button onClick={() => setCurrentStep(0)} className="btn btn-secondary">
            <RotateCcw size={16} /> Repeat Grounding
          </button>
        </div>
      )}

    </div>
  );
}
