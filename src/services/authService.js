/**
 * Persistent Authentication Service for Node.js Express & SQLite Backend
 * Enforces mandatory user authentication and handles Remember Me session persistence.
 */

const API_BASE = '/api/auth';
const TOKEN_KEY = 'auramind_auth_token';
const USER_KEY = 'auramind_auth_user';
const REMEMBERED_EMAIL_KEY = 'auramind_remembered_email';

export class AuthService {
  /**
   * Get currently authenticated user from localStorage or sessionStorage.
   * Returns null if unauthenticated (strictly forcing login).
   */
  static getCurrentUser() {
    try {
      const localUser = localStorage.getItem(USER_KEY);
      if (localUser) {
        return JSON.parse(localUser);
      }

      const sessionUser = sessionStorage.getItem(USER_KEY);
      if (sessionUser) {
        return JSON.parse(sessionUser);
      }

      return null;
    } catch (err) {
      return null;
    }
  }

  /**
   * Get active JWT Token
   */
  static getToken() {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null;
  }

  /**
   * Get pre-saved email for "Remember Me" input pre-filling
   */
  static getRememberedEmail() {
    return localStorage.getItem(REMEMBERED_EMAIL_KEY) || '';
  }

  /**
   * Login user via Express/SQLite backend and save session based on rememberMe option
   */
  static async login(email, password, rememberMe = true) {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed. Please check your credentials.');
    }

    if (rememberMe) {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
    } else {
      sessionStorage.setItem(TOKEN_KEY, data.token);
      sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
      localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }

    return { success: true, user: data.user, token: data.token };
  }

  /**
   * Register user via Express/SQLite backend and save session
   */
  static async register(name, email, password, rememberMe = true) {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed.');
    }

    if (rememberMe) {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
    } else {
      sessionStorage.setItem(TOKEN_KEY, data.token);
      sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
      localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }

    return { success: true, user: data.user, token: data.token };
  }

  /**
   * Logout user and clear active tokens
   */
  static logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }
}

