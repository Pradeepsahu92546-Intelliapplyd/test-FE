import { Injectable } from '@angular/core';

/**
 * SessionStorage Service
 * Manages token storage with base64 encryption in browser session storage
 * Tokens are encoded to base64 when stored and decoded when retrieved
 */
@Injectable({
  providedIn: 'root',
})
export class SessionStorage {
  private readonly ACCESS_TOKEN_KEY = 'app_access_token';
  private readonly VERIFICATION_TOKEN_KEY = 'app_verification_token';
  private readonly VERIFICATION_TOKEN_EXPIRY_KEY = 'app_verification_token_expiry';
  private readonly USER_EMAIL_KEY = 'app_user_email';

  constructor() {}

  /**
   * Encode string to base64
   * @param str Plain text string to encode
   * @returns Base64 encoded string
   */
  private encodeToBase64(str: string): string {
    try {
      return btoa(str);
    } catch (error) {
      console.error('Error encoding to base64:', error);
      return str;
    }
  }

  /**
   * Decode base64 string to plain text
   * @param str Base64 encoded string to decode
   * @returns Plain text string
   */
  private decodeFromBase64(str: string): string {
    try {
      return atob(str);
    } catch (error) {
      console.error('Error decoding from base64:', error);
      return str;
    }
  }

  /**
   * Store access token in session storage (base64 encoded)
   * @param token Plain text token to store
   */
  setAccessToken(token: string): void {
    try {
      const encoded = this.encodeToBase64(token);
      sessionStorage.setItem(this.ACCESS_TOKEN_KEY, encoded);
      console.log('Access token stored in session storage (base64 encrypted)');
    } catch (error) {
      console.error('Error storing access token:', error);
    }
  }

  /**
   * Retrieve access token from session storage (base64 decoded)
   * @returns Plain text token or null if not found
   */
  getAccessToken(): string | null {
    try {
      const encoded = sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
      if (!encoded) return null;
      return this.decodeFromBase64(encoded);
    } catch (error) {
      console.error('Error retrieving access token:', error);
      return null;
    }
  }

  /**
   * Clear access token from session storage
   */
  clearAccessToken(): void {
    try {
      sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
      console.log('Access token cleared from session storage');
    } catch (error) {
      console.error('Error clearing access token:', error);
    }
  }

  /**
   * Store verification token in session storage (base64 encoded)
   * @param token Plain text verification token to store
   * @param expiresInSeconds Optional expiry time in seconds
   */
  setVerificationToken(token: string, expiresInSeconds?: number): void {
    try {
      const encoded = this.encodeToBase64(token);
      sessionStorage.setItem(this.VERIFICATION_TOKEN_KEY, encoded);

      if (expiresInSeconds != null) {
        const expiryTime = Date.now() + expiresInSeconds * 1000;
        sessionStorage.setItem(this.VERIFICATION_TOKEN_EXPIRY_KEY, expiryTime.toString());
      }
      console.log('Verification token stored in session storage (base64 encrypted)');
    } catch (error) {
      console.error('Error storing verification token:', error);
    }
  }

  /**
   * Retrieve verification token from session storage (base64 decoded)
   * Returns null if token has expired
   * @returns Plain text verification token or null if not found or expired
   */
  getVerificationToken(): string | null {
    try {
      const encoded = sessionStorage.getItem(this.VERIFICATION_TOKEN_KEY);
      if (!encoded) return null;

      // Check if token has expired
      const expiryStr = sessionStorage.getItem(this.VERIFICATION_TOKEN_EXPIRY_KEY);
      if (expiryStr) {
        const expiry = parseInt(expiryStr, 10);
        if (Date.now() > expiry) {
          this.clearVerificationToken();
          return null;
        }
      }

      return this.decodeFromBase64(encoded);
    } catch (error) {
      console.error('Error retrieving verification token:', error);
      return null;
    }
  }

  /**
   * Clear verification token and expiry from session storage
   */
  clearVerificationToken(): void {
    try {
      sessionStorage.removeItem(this.VERIFICATION_TOKEN_KEY);
      sessionStorage.removeItem(this.VERIFICATION_TOKEN_EXPIRY_KEY);
      console.log('Verification token cleared from session storage');
    } catch (error) {
      console.error('Error clearing verification token:', error);
    }
  }

  /**
   * Store user email in session storage (base64 encoded)
   * @param email User email to store
   */
  setUserEmail(email: string): void {
    try {
      const encoded = this.encodeToBase64(email);
      sessionStorage.setItem(this.USER_EMAIL_KEY, encoded);
    } catch (error) {
      console.error('Error storing user email:', error);
    }
  }

  /**
   * Retrieve user email from session storage (base64 decoded)
   * @returns Plain text email or null if not found
   */
  getUserEmail(): string | null {
    try {
      const encoded = sessionStorage.getItem(this.USER_EMAIL_KEY);
      if (!encoded) return null;
      return this.decodeFromBase64(encoded);
    } catch (error) {
      console.error('Error retrieving user email:', error);
      return null;
    }
  }

  /**
   * Clear user email from session storage
   */
  clearUserEmail(): void {
    try {
      sessionStorage.removeItem(this.USER_EMAIL_KEY);
    } catch (error) {
      console.error('Error clearing user email:', error);
    }
  }

  /**
   * Clear all session data (used during logout)
   */
  clearAll(): void {
    try {
      this.clearAccessToken();
      this.clearVerificationToken();
      this.clearUserEmail();
      console.log('All session data cleared');
    } catch (error) {
      console.error('Error clearing all session data:', error);
    }
  }

  /**
   * Check if user is logged in (has valid access token)
   * @returns True if access token exists, false otherwise
   */
  hasValidToken(): boolean {
    return this.getAccessToken() !== null;
  }
}
