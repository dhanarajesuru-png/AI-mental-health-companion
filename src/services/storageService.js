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
  TRUSTED_CONTACTS: 'auramind_trusted_contacts',
  GUARDRAIL_STATS: 'auramind_guardrail_stats'
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
    // Return only real user-logged data — no demo defaults
    return this.get(STORAGE_KEYS.MOOD_LOGS) || [];
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
    // Return only real user-created memory items — no demo defaults
    return this.get(STORAGE_KEYS.MEMORY_SUMMARIES) || [];
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
      name: "",
      phone: "",
      email: ""
    };
  }

  static saveTrustedContacts(contacts) {
    this.set(STORAGE_KEYS.TRUSTED_CONTACTS, contacts);
    return contacts;
  }

  // --- GUARDRAIL STATS (from Red-Team Lab runs) ---
  static getGuardrailStats() {
    return this.get(STORAGE_KEYS.GUARDRAIL_STATS) || null; // null = no tests run yet
  }

  static saveGuardrailStats({ total, passed }) {
    const stats = { total, passed, updatedAt: new Date().toISOString() };
    this.set(STORAGE_KEYS.GUARDRAIL_STATS, stats);
    return stats;
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
