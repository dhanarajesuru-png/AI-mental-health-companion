/**
 * Persistent Authentication Service for Node.js Express & SQLite Backend
 * Enforces mandatory user authentication and handles Remember Me session persistence.
 */

const getBackendUrl = () => {
  const host = typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : 'localhost';
  return `http://${host}:5000/api/auth`;
};
const RELATIVE_URL = '/api/auth';
const TOKEN_KEY = 'auramind_auth_token';
const USER_KEY = 'auramind_auth_user';
const REMEMBERED_EMAIL_KEY = 'auramind_remembered_email';

export class AuthService {
  /**
   * Helper method to send authentication POST requests safely with fallbacks
   */
  static async postAuth(endpoint, payload) {
    let response;
    let url = `${getBackendUrl()}/${endpoint}`;

    try {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      // Retry with relative URL if direct backend URL fetch failed
      try {
        url = `${RELATIVE_URL}/${endpoint}`;
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (retryErr) {
        throw new Error("Unable to connect to authentication server. Please check your network connection.");
      }
    }

    const contentType = response.headers.get('content-type') || '';
    let data;

    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      throw new Error("Invalid response from server. Please verify your credentials or register a new account.");
    }

    if (!response.ok) {
      throw new Error(data.error || 'Authentication error occurred.');
    }

    return data;
  }

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
    const data = await this.postAuth('login', { email, password });

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
    const data = await this.postAuth('register', { name, email, password });

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


