'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

type AuthCtx = { user: User | null; loading: boolean; userName: string; setUserName: (n: string) => void };
const AuthContext = createContext<AuthCtx>({ user: null, loading: true, userName: '', setUserName: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserNameState] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    const stored = localStorage.getItem('userName') || '';
    setUserNameState(stored);
    return () => subscription.unsubscribe();
  }, []);

  const setUserName = (n: string) => {
    setUserNameState(n);
    localStorage.setItem('userName', n);
  };

  return <AuthContext.Provider value={{ user, loading, userName, setUserName }}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }
