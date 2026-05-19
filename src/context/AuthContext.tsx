import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/supabase';
import type { Profile } from '../lib/mockData';

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const profile = await db.auth.getCurrentUser();
      setUser(profile);
    } catch (err) {
      console.error('Error loading current user:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { user: profile, error } = await db.auth.signIn(email, password);
    if (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
    setUser(profile);
    setLoading(false);
    return { success: true, error: null };
  };

  const signOut = async () => {
    setLoading(true);
    await db.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  const refreshUser = async () => {
    const profile = await db.auth.getCurrentUser();
    setUser(profile);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
