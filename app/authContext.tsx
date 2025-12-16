import React, { createContext, useState, useEffect } from 'react';
import { useStorageState } from './useStorageState';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '@/services/auth';
import { User, LoginCredentials, SignUpCredentials } from '@/types';

interface AuthContextData {
  user: User | null;
  signIn: (username: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithInstagram: () => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  devMockLogin?: () => Promise<void>;
  session?: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');
  const [user, setUser] = useState<User | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (session) {
        try {
          const verifiedUser = await authService.verifyToken(session);
          if (verifiedUser) {
            setUser(verifiedUser);
          } else {
            // Token invalid, clear session
            await AsyncStorage.removeItem('jwt');
            setSession(null);
          }
        } catch (error) {
          console.error('Auth verification error:', error);
          await AsyncStorage.removeItem('jwt');
          setSession(null);
        }
      }
    };
    checkAuth();
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      const credentials: LoginCredentials = { email: username, password };
      const response = await authService.signInWithEmail(credentials);

      await AsyncStorage.setItem('jwt', response.token);
      setSession(response.token);
      setUser(response.user);
    } catch (error: any) {
      console.error('SignIn error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const response = await authService.signInWithGoogle();
      await AsyncStorage.setItem('jwt', response.token);
      setSession(response.token);
      setUser(response.user);
    } catch (error: any) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const signInWithApple = async () => {
    try {
      const response = await authService.signInWithApple();
      await AsyncStorage.setItem('jwt', response.token);
      setSession(response.token);
      setUser(response.user);
    } catch (error: any) {
      console.error('Apple sign in error:', error);
      throw error;
    }
  };

  const signInWithFacebook = async () => {
    try {
      const response = await authService.signInWithFacebook();
      await AsyncStorage.setItem('jwt', response.token);
      setSession(response.token);
      setUser(response.user);
    } catch (error: any) {
      console.error('Facebook sign in error:', error);
      throw error;
    }
  };

  const signInWithInstagram = async () => {
    try {
      const response = await authService.signInWithInstagram();
      await AsyncStorage.setItem('jwt', response.token);
      setSession(response.token);
      setUser(response.user);
    } catch (error: any) {
      console.error('Instagram sign in error:', error);
      throw error;
    }
  };

  const devMockLogin = async () => {
    try {
      const response = await authService.devMockLogin();
      await AsyncStorage.setItem('jwt', response.token);
      setSession(response.token);
      setUser(response.user);
    } catch (error: any) {
      console.error('Dev mock login error:', error);
      throw error;
    }
  };

  const signUp = async (credentials: SignUpCredentials) => {
    try {
      const response = await authService.signUpWithEmail(credentials);
      await AsyncStorage.setItem('jwt', response.token);
      setSession(response.token);
      setUser(response.user);
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      await AsyncStorage.removeItem('jwt');
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      // Still clear local state even if API call fails
      await AsyncStorage.removeItem('jwt');
      setSession(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signInWithGoogle,
        signInWithApple,
        signInWithFacebook,
        signInWithInstagram,
        signUp,
        signOut,
        devMockLogin: __DEV__ ? devMockLogin : undefined,
        session,
        isLoading,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}
