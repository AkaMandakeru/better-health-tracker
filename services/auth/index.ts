// Authentication service
// Supports email, Google, Apple, Facebook, and Instagram login

import { LoginCredentials, SignUpCredentials, AuthResponse, User } from '@/types';
import * as WebBrowser from 'expo-web-browser';

// Mock authentication service
// In production, this would call your backend API

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user storage
const mockUsers: Array<{ email: string; password: string; user: User }> = [];

export const authService = {
  // Email/Password Authentication
  async signInWithEmail(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(1000);

    // Mock validation
    const user = mockUsers.find(u => u.email === credentials.email);

    if (!user || user.password !== credentials.password) {
      throw new Error('Invalid email or password');
    }

    return {
      token: `mock-token-${Date.now()}`,
      user: user.user,
    };
  },

  async signUpWithEmail(credentials: SignUpCredentials): Promise<AuthResponse> {
    await delay(1000);

    // Check if user already exists
    if (mockUsers.some(u => u.email === credentials.email)) {
      throw new Error('User with this email already exists');
    }

    // Validate passwords match
    if (credentials.password !== credentials.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: credentials.name,
      email: credentials.email,
      provider: 'email',
    };

    mockUsers.push({
      email: credentials.email,
      password: credentials.password,
      user: newUser,
    });

    return {
      token: `mock-token-${Date.now()}`,
      user: newUser,
    };
  },

  // Google Authentication
  async signInWithGoogle(): Promise<AuthResponse> {
    await delay(1500);

    // In production, use expo-auth-session or similar
    // For now, mock the response
    const mockGoogleUser: User = {
      id: `google-user-${Date.now()}`,
      name: 'Google User',
      email: `google-${Date.now()}@example.com`,
      provider: 'google',
    };

    return {
      token: `mock-google-token-${Date.now()}`,
      user: mockGoogleUser,
    };
  },

  // Apple Authentication
  async signInWithApple(): Promise<AuthResponse> {
    await delay(1500);

    // In production, use expo-apple-authentication
    const mockAppleUser: User = {
      id: `apple-user-${Date.now()}`,
      name: 'Apple User',
      email: `apple-${Date.now()}@example.com`,
      provider: 'apple',
    };

    return {
      token: `mock-apple-token-${Date.now()}`,
      user: mockAppleUser,
    };
  },

  // Facebook Authentication
  async signInWithFacebook(): Promise<AuthResponse> {
    await delay(1500);

    // In production, use expo-facebook or similar
    const mockFacebookUser: User = {
      id: `facebook-user-${Date.now()}`,
      name: 'Facebook User',
      email: `facebook-${Date.now()}@example.com`,
      provider: 'facebook',
    };

    return {
      token: `mock-facebook-token-${Date.now()}`,
      user: mockFacebookUser,
    };
  },

  // Instagram Authentication
  async signInWithInstagram(): Promise<AuthResponse> {
    await delay(1500);

    // In production, use Instagram OAuth
    const mockInstagramUser: User = {
      id: `instagram-user-${Date.now()}`,
      name: 'Instagram User',
      email: `instagram-${Date.now()}@example.com`,
      provider: 'instagram',
    };

    return {
      token: `mock-instagram-token-${Date.now()}`,
      user: mockInstagramUser,
    };
  },

  // Sign out
  async signOut(): Promise<void> {
    await delay(300);
    // In production, invalidate token on server
  },

  // Verify token (for checking if user is still authenticated)
  async verifyToken(token: string): Promise<User | null> {
    await delay(500);
    // In production, verify with backend
    // For mock, just return null if token is invalid
    if (token.startsWith('mock-token-') || token.startsWith('mock-google-token-') ||
        token.startsWith('mock-apple-token-') || token.startsWith('mock-facebook-token-') ||
        token.startsWith('mock-instagram-token-') || token.startsWith('dev-mock-token-')) {
      // Return a mock user
      return {
        id: 'user-123',
        name: 'Mock User',
        email: 'user@example.com',
      };
    }
    return null;
  },

  // Development-only: Quick mock login
  async devMockLogin(): Promise<AuthResponse> {
    await delay(300);

    const devUser: User = {
      id: 'dev-user-123',
      name: 'Dev Test User',
      email: 'dev@test.com',
      provider: 'email',
    };

    // Store in mock users for consistency
    const existingUser = mockUsers.find(u => u.email === devUser.email);
    if (!existingUser) {
      mockUsers.push({
        email: devUser.email,
        password: 'dev123',
        user: devUser,
      });
    }

    return {
      token: `dev-mock-token-${Date.now()}`,
      user: devUser,
    };
  },
};

