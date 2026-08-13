import React, { useState } from 'react';
import { HeartHandshake, Trash2, Plus, Lock, KeyRound, ShieldCheck } from 'lucide-react';
import { StorageService } from '../services/storageService';

export default function MemoryManager() {
  const [memories, setMemories] = useState(() => StorageService.getMemorySummaries());
  const [newMemory, setNewMemory] = useState('');

  const handleAdd = () => {
    if (!newMemory.trim()) return;
    const updated = StorageService.saveMemorySummary(newMemory.trim());
    setMemories(updated);
    setNewMemory('');
  };

  const handleDelete = (id) => {
    const updated = StorageService.deleteMemorySummary(id);
    setMemories(updated);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minHeight: 'calc(100vh - 180px)' }}>
      
      {/* Page Hero Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(180, 83, 9, 0.05) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
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
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)'
          }}>
            <KeyRound size={22} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', margin: 0, color: '#fef3c7' }}>Memory Vault Page</h2>
            <p style={{ fontSize: '0.82rem', color: '#fde68a', margin: 0 }}>
              Zero-Raw-PII Encrypted Memory Vault for personalized AI session context
            </p>
          </div>
        </div>

        <span className="badge badge-amber">
          <Lock size={12} /> Passphrase Protected
        </span>
      </div>

      {/* Main Memory Vault Container */}
      <div className="module-memory-container" style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Add Memory Input Box */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
          <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.75rem' }}>Record Custom Companion Memory Note</h4>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input 
              type="text"
              className="input-field"
              placeholder="e.g., 'Prefers box breathing over 5-4-3-2-1 grounding when feeling anxious at night.'"
              value={newMemory}
              onChange={(e) => setNewMemory(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <button 
              onClick={handleAdd} 
              className="btn btn-primary"
              style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#fff' }}
            >
              <Plus size={16} /> Add Memory
            </button>
          </div>
        </div>

        {/* Active Vault Cards */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(245, 158, 11, 0.2)', flex: 1 }}>
          <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '1rem' }}>Active Vault Context Items ({memories.length})</h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {memories.map((mem) => (
              <div key={mem.id} className="memory-vault-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.92rem', color: '#fef3c7', margin: 0, fontWeight: 500 }}>
                      "{mem.text}"
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem', display: 'block' }}>
                      Created on {mem.createdAt} • Zero PII Verified
                    </span>
                  </div>

                  <button 
                    onClick={() => handleDelete(mem.id)}
                    className="btn btn-secondary"
                    style={{ color: '#f43f5e', padding: '0.45rem', borderColor: 'rgba(244, 63, 94, 0.3)' }}
                    title="Purge memory item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {!memories.length && (
              <p style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>
                No memory summaries stored in vault. The AI companion will operate in zero-context mode.
              </p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
