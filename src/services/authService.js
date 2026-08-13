/**
 * AuraMind Authentication Service
 *
 * Dual-mode auth:
 *  - LOCAL (localhost / LAN): Uses Express + SQLite backend on port 5000
 *  - PRODUCTION (Vercel / deployed): Uses client-side localStorage auth with
 *    SHA-256 password hashing via crypto-js (no server required)
 */

import CryptoJS from 'crypto-js';

const TOKEN_KEY = 'auramind_auth_token';
const USER_KEY = 'auramind_auth_user';
const REMEMBERED_EMAIL_KEY = 'auramind_remembered_email';
const LOCAL_USERS_KEY = 'auramind_users_db';

// Detect if running locally with backend available
function isLocalDev() {
  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  return host === 'localhost' || host === '127.0.0.1' || /^192\.168\.|^10\.|^172\.(1[6-9]|2[0-9]|3[01])\./.test(host);
}

// ============================================================
// CLIENT-SIDE AUTH HELPERS (used in production / Vercel)
// ============================================================

function hashPassword(password) {
  return CryptoJS.SHA256(password + 'auramind_salt_2026').toString();
}

function getLocalUsersDb() {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalUsersDb(db) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(db));
}

function generateToken(user) {
  // Simple signed token for client-side — not JWT but sufficient for SPA
  const payload = btoa(JSON.stringify({ id: user.id, email: user.email, name: user.name, ts: Date.now() }));
  const sig = CryptoJS.SHA256(payload + 'auramind_jwt_secret_2026').toString().substring(0, 16);
  return `${payload}.${sig}`;
}

function clientRegister(name, email, password) {
  const db = getLocalUsersDb();
  const normalizedEmail = email.toLowerCase().trim();

  if (db[normalizedEmail]) {
    throw new Error('An account with this email already exists.');
  }
  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required.');
  }
  if (password.length < 4) {
    throw new Error('Password must be at least 4 characters long.');
  }

  const userId = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const user = { id: userId, name: name.trim(), email: normalizedEmail, password: hashPassword(password), createdAt: new Date().toISOString() };
  db[normalizedEmail] = user;
  saveLocalUsersDb(db);

  return { user: { id: userId, name: user.name, email: normalizedEmail }, token: generateToken(user) };
}

function clientLogin(email, password) {
  const db = getLocalUsersDb();
  const normalizedEmail = email.toLowerCase().trim();
  const user = db[normalizedEmail];

  if (!user) {
    throw new Error('No account found with this email. Please sign up first.');
  }
  if (user.password !== hashPassword(password)) {
    throw new Error('Incorrect password. Please try again.');
  }

  return { user: { id: user.id, name: user.name, email: normalizedEmail }, token: generateToken(user) };
}

// ============================================================
// BACKEND AUTH HELPERS (used in local dev)
// ============================================================

async function backendAuth(endpoint, payload) {
  const host = window.location.hostname;
  const url = `http://${host}:5000/api/auth/${endpoint}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Server returned an unexpected response. Please try again.');
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Authentication failed.');
  }

  return data;
}

// ============================================================
// AUTH SERVICE CLASS
// ============================================================

export class AuthService {
  /**
   * Get currently authenticated user from localStorage or sessionStorage.
   */
  static getCurrentUser() {
    try {
      const localUser = localStorage.getItem(USER_KEY);
      if (localUser) return JSON.parse(localUser);
      const sessionUser = sessionStorage.getItem(USER_KEY);
      if (sessionUser) return JSON.parse(sessionUser);
      return null;
    } catch {
      return null;
    }
  }

  static getToken() {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null;
  }

  static getRememberedEmail() {
    return localStorage.getItem(REMEMBERED_EMAIL_KEY) || '';
  }

  static _saveSession(user, token, rememberMe, email) {
    const store = rememberMe ? localStorage : sessionStorage;
    const clear = rememberMe ? sessionStorage : localStorage;
    store.setItem(TOKEN_KEY, token);
    store.setItem(USER_KEY, JSON.stringify(user));
    if (rememberMe) {
      localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
    } else {
      localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }
  }

  /**
   * Login — uses backend locally, client-side on production
   */
  static async login(email, password, rememberMe = true) {
    let user, token;

    if (isLocalDev()) {
      try {
        const data = await backendAuth('login', { email, password });
        user = data.user;
        token = data.token;
      } catch (backendErr) {
        // Backend unreachable locally → fall through to client-side
        const result = clientLogin(email, password);
        user = result.user;
        token = result.token;
      }
    } else {
      // Production / Vercel
      const result = clientLogin(email, password);
      user = result.user;
      token = result.token;
    }

    this._saveSession(user, token, rememberMe, email);
    return { success: true, user, token };
  }

  /**
   * Register — uses backend locally, client-side on production
   */
  static async register(name, email, password, rememberMe = true) {
    let user, token;

    if (isLocalDev()) {
      try {
        const data = await backendAuth('register', { name, email, password });
        user = data.user;
        token = data.token;
      } catch (backendErr) {
        // Backend unreachable locally → fall through to client-side
        const result = clientRegister(name, email, password);
        user = result.user;
        token = result.token;
      }
    } else {
      // Production / Vercel
      const result = clientRegister(name, email, password);
      user = result.user;
      token = result.token;
    }

    this._saveSession(user, token, rememberMe, email);
    return { success: true, user, token };
  }

  static logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }
}
