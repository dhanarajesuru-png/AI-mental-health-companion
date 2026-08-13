/**
 * Storage & Encrypted Data Persistence Service
 * Supports local storage encryption using AES-256 (CryptoJS)
 * and data control options (Export, Purge, Memory Summary Manager).
 */

import CryptoJS from 'crypto-js';

const STORAGE_KEYS = {
  MOOD_LOGS: 'auramind_mood_logs',
  CBT_RECORDS: 'auramind_cbt_records',
  MEMORY_SUMMARIES: 'auramind_memory_summaries',
  SETTINGS: 'auramind_settings',
  TRUSTED_CONTACTS: 'auramind_trusted_contacts'
};

const DEFAULT_SECRET = 'auramind_local_secure_key_2026';

export class StorageService {
  /**
   * Helper to retrieve and decrypt data
   */
  static get(key, passphrase = DEFAULT_SECRET) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const bytes = CryptoJS.AES.decrypt(raw, passphrase);
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedText ? JSON.parse(decryptedText) : JSON.parse(raw);
    } catch {
      // Fallback for unencrypted legacy JSON
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    }
  }

  /**
   * Helper to encrypt and save data
   */
  static set(key, data, passphrase = DEFAULT_SECRET) {
    try {
      const jsonString = JSON.stringify(data);
      const encrypted = CryptoJS.AES.encrypt(jsonString, passphrase).toString();
      localStorage.setItem(key, encrypted);
    } catch (e) {
      console.error("Storage save error:", e);
    }
  }

  // --- MOOD LOGS ---
  static getMoodLogs() {
    return this.get(STORAGE_KEYS.MOOD_LOGS) || [
      { id: 'm1', date: '2026-08-08', valence: 'good', score: 8, tags: ['Work', 'Sleep'], note: 'Good productive day.' },
      { id: 'm2', date: '2026-08-09', valence: 'anxious', score: 4, tags: ['Work', 'Stress'], note: 'Felt overwhelmed by deadlines.' },
      { id: 'm3', date: '2026-08-10', valence: 'neutral', score: 6, tags: ['Health'], note: 'Did 4-7-8 breathing in afternoon.' },
      { id: 'm4', date: '2026-08-11', valence: 'great', score: 9, tags: ['Exercise', 'Family'], note: 'Felt calm and refreshed.' }
    ];
  }

  static saveMoodLog(log) {
    const logs = this.getMoodLogs();
    const newLog = {
      id: `m_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      ...log
    };
    logs.unshift(newLog);
    this.set(STORAGE_KEYS.MOOD_LOGS, logs);
    return logs;
  }

  // --- CBT RECORDS ---
  static getCBTRecords() {
    return this.get(STORAGE_KEYS.CBT_RECORDS) || [];
  }

  static saveCBTRecord(record) {
    const records = this.getCBTRecords();
    const newRecord = {
      id: `cbt_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...record
    };
    records.unshift(newRecord);
    this.set(STORAGE_KEYS.CBT_RECORDS, records);
    return records;
  }

  // --- MEMORY SUMMARIES ---
  static getMemorySummaries() {
    return this.get(STORAGE_KEYS.MEMORY_SUMMARIES) || [
      { id: 'mem-1', text: 'Responds positively to 4-7-8 breathing exercises during work stress.', createdAt: '2026-08-09' },
      { id: 'mem-2', text: 'Identified all-or-nothing thinking pattern around project deadlines.', createdAt: '2026-08-10' }
    ];
  }

  static saveMemorySummary(text) {
    const memories = this.getMemorySummaries();
    const newMem = {
      id: `mem_${Date.now()}`,
      text,
      createdAt: new Date().toISOString().split('T')[0]
    };
    memories.unshift(newMem);
    this.set(STORAGE_KEYS.MEMORY_SUMMARIES, memories);
    return memories;
  }

  static deleteMemorySummary(id) {
    const memories = this.getMemorySummaries().filter(m => m.id !== id);
    this.set(STORAGE_KEYS.MEMORY_SUMMARIES, memories);
    return memories;
  }

  // --- TRUSTED CONTACTS ---
  static getTrustedContacts() {
    return this.get(STORAGE_KEYS.TRUSTED_CONTACTS) || {
      name: "Dr. Sarah Jenkins (Therapist) / Alex (Partner)",
      phone: "+1 (555) 019-2834",
      email: "contact@support.org"
    };
  }

  static saveTrustedContacts(contacts) {
    this.set(STORAGE_KEYS.TRUSTED_CONTACTS, contacts);
    return contacts;
  }

  // --- DATA CONTROL ---
  static exportData() {
    const exportObject = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      moodLogs: this.getMoodLogs(),
      cbtRecords: this.getCBTRecords(),
      memorySummaries: this.getMemorySummaries(),
      trustedContacts: this.getTrustedContacts()
    };
    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auramind_encrypted_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  static purgeAllData() {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    localStorage.clear();
  }
}
