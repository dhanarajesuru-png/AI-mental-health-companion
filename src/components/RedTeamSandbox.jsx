import React, { useState } from 'react';
import { TestTube2, Play, CheckCircle2, XCircle, Terminal, Cpu, ShieldAlert } from 'lucide-react';
import { RED_TEAM_SUITES } from '../data/redTeamScenarios';
import { SafetyPipeline } from '../services/safetyPipeline';

export default function RedTeamSandbox() {
  const [testResults, setTestResults] = useState({});
  const [customInput, setCustomInput] = useState('');
  const [customResult, setCustomResult] = useState(null);

  const runSingleTest = (promptObj) => {
    const evalResult = SafetyPipeline.evaluateInput(promptObj.input);
    const passed = evalResult.action === promptObj.expectedAction;

    setTestResults(prev => ({
      ...prev,
      [promptObj.id]: {
        ...evalResult,
        passed,
        expectedAction: promptObj.expectedAction
      }
    }));
  };

  const runAllSuiteTests = () => {
    const newResults = {};
    RED_TEAM_SUITES.forEach(suite => {
      suite.prompts.forEach(p => {
        const evalResult = SafetyPipeline.evaluateInput(p.input);
        const passed = evalResult.action === p.expectedAction;
        newResults[p.id] = {
          ...evalResult,
          passed,
          expectedAction: p.expectedAction
        };
      });
    });
    setTestResults(newResults);
  };

  const handleRunCustom = () => {
    if (!customInput.trim()) return;
    const res = SafetyPipeline.evaluateInput(customInput.trim());
    setCustomResult(res);
  };

  const totalTested = Object.keys(testResults).length;
  const totalPassed = Object.values(testResults).filter(r => r.passed).length;
  const passRate = totalTested ? Math.round((totalPassed / totalTested) * 100) : 0;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minHeight: 'calc(100vh - 180px)' }}>
      
      {/* Page Hero Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(190, 18, 60, 0.05) 100%)',
        border: '1px solid rgba(244, 63, 94, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(244, 63, 94, 0.4)'
          }}>
            <Cpu size={22} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', margin: 0, color: '#ffe4e6' }}>Red-Team Lab Security Command Center Page</h2>
            <p style={{ fontSize: '0.82rem', color: '#fecdd3', margin: 0 }}>
              Adversarial stress-testing suite for Layer 1 Regex & Layer 2 Semantic Classifiers
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {totalTested > 0 && (
            <div style={{ textAlign: 'right', background: 'rgba(244, 63, 94, 0.12)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              <span style={{ fontSize: '0.75rem', color: '#fecdd3' }}>Guardrail Accuracy Rate</span>
              <h4 style={{ fontSize: '1.3rem', color: passRate === 100 ? '#34d399' : '#fbbf24', margin: 0 }}>
                {passRate}% ({totalPassed}/{totalTested})
              </h4>
            </div>
          )}

          <button onClick={runAllSuiteTests} className="btn btn-danger" style={{ padding: '0.65rem 1.15rem' }}>
            <Play size={16} /> Execute Full Red-Team Battery
          </button>
        </div>
      </div>

      {/* Main Red-Team Container */}
      <div className="module-redteam-container" style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Monospace Terminal Evaluator */}
        <div className="cyber-terminal" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem', color: '#f43f5e' }}>
            <Terminal size={18} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Interactive Security Guardrail Terminal
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{ position: 'absolute', left: '1rem', top: '0.75rem', color: '#f43f5e', fontFamily: 'monospace' }}>$</span>
              <input 
                type="text"
                className="input-field"
                style={{ paddingLeft: '2.2rem', fontFamily: 'monospace', background: '#0a0307', borderColor: 'rgba(244, 63, 94, 0.3)' }}
                placeholder="Type test prompt (e.g. 'Should I increase my dosage of Sertraline?')"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunCustom()}
              />
            </div>
            <button onClick={handleRunCustom} className="btn btn-danger">
              Evaluate Prompt
            </button>
          </div>

          {customResult && (
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${customResult.riskLevel === 'CRITICAL' ? '#f43f5e' : '#34d399'}`,
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              fontFamily: 'monospace',
              fontSize: '0.85rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <span className={`badge ${customResult.riskLevel === 'CRITICAL' ? 'badge-rose' : customResult.riskLevel === 'HIGH' ? 'badge-amber' : 'badge-emerald'}`}>
                  Risk: {customResult.riskLevel}
                </span>
                <span style={{ color: '#94a3b8' }}>• Engine: {customResult.layerTriggered}</span>
              </div>
              <div style={{ color: '#e2e8f0', marginTop: '0.4rem' }}>
                Action: <strong style={{ color: '#38bdf8' }}>{customResult.action}</strong> — {customResult.reason}
              </div>
            </div>
          )}
        </div>

        {/* Pre-built Test Suites */}
        {RED_TEAM_SUITES.map(suite => (
          <div key={suite.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
            <h4 style={{ fontSize: '1.05rem', color: '#fecdd3', marginBottom: '0.3rem' }}>{suite.category}</h4>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>{suite.description}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {suite.prompts.map(p => {
                const result = testResults[p.id];
                return (
                  <div key={p.id} style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.9rem 1.15rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 600, margin: 0 }}>
                        "{p.input}"
                      </p>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem', display: 'block' }}>
                        {p.notes}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {result ? (
                        <span className={`badge ${result.passed ? 'badge-emerald' : 'badge-rose'}`}>
                          {result.passed ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                          {result.passed ? 'PASSED' : 'FAILED'} ({result.riskLevel})
                        </span>
                      ) : (
                        <span className="badge badge-indigo">Unchecked</span>
                      )}

                      <button 
                        onClick={() => runSingleTest(p)}
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                      >
                        <Play size={13} /> Run
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}
