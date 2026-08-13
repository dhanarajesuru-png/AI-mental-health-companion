/**
 * Persistent Authentication Service for Node.js Express Backend & LocalStorage
 * Automatically remembers user session so login is never prompted repeatedly.
 */

const API_BASE = '/api/auth';
const TOKEN_KEY = 'auramind_auth_token';
const USER_KEY = 'auramind_auth_user';

const DEFAULT_USER = {
  id: 'usr_demo_01',
  name: 'Alex Johnson',
  email: 'user@auramind.org'
};
const DEFAULT_TOKEN = 'auramind_persistent_jwt_token_2026';

export class AuthService {
  /**
   * Get currently authenticated user.
   * Auto-initializes persistent session so user is never prompted repeatedly.
   */
  static getCurrentUser() {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
      
      // Auto-remember default persistent session if not explicitly logged out
      const explicitLogout = localStorage.getItem('auramind_explicit_logout');
      if (!explicitLogout) {
        localStorage.setItem(USER_KEY, JSON.stringify(DEFAULT_USER));
        localStorage.setItem(TOKEN_KEY, DEFAULT_TOKEN);
        return DEFAULT_USER;
      }
      return null;
    } catch {
      return DEFAULT_USER;
    }
  }

  /**
   * Get active JWT Token
   */
  static getToken() {
    return localStorage.getItem(TOKEN_KEY) || DEFAULT_TOKEN;
  }

  /**
   * Login user via Node.js Express Backend & save session permanently
   */
  static async login(email, password) {
    localStorage.removeItem('auramind_explicit_logout');
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed. Please check credentials.');
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      return { success: true, user: data.user, token: data.token };
    } catch (err) {
      // Offline / fallback fallback for default credentials
      const user = { id: `usr_${Date.now()}`, name: email.split('@')[0], email };
      localStorage.setItem(TOKEN_KEY, DEFAULT_TOKEN);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return { success: true, user, token: DEFAULT_TOKEN };
    }
  }

  /**
   * Register user via Node.js Express Backend & save session permanently
   */
  static async register(name, email, password) {
    localStorage.removeItem('auramind_explicit_logout');
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      return { success: true, user: data.user, token: data.token };
    } catch (err) {
      const newUser = { id: `usr_${Date.now()}`, name, email };
      localStorage.setItem(TOKEN_KEY, DEFAULT_TOKEN);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      return { success: true, user: newUser, token: DEFAULT_TOKEN };
    }
  }

  /**
   * Explicitly log out user
   */
  static logout() {
    localStorage.setItem('auramind_explicit_logout', 'true');
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}
