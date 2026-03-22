'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = async () => {
    setLoading(true);
    setError('');
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.replace('/');
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else {
        if (name) localStorage.setItem('userName', name);
        router.replace('/');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: '#1C1C1E' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-white mb-2">Kartoittaja</h1>
          <p className="text-sm" style={{ color: '#8E8E93' }}>Analyysi: Onelab</p>
        </div>
        <div className="rounded-2xl p-6" style={{ background: '#2C2C2E', border: '1px solid rgba(255,255,255,0.08)' }}>
          {mode === 'register' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-1">Nimi</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500" style={{ background: '#3A3A3C', border: '1px solid rgba(255,255,255,0.1)' }} placeholder="Matti Meikäläinen" />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-1">Sähköposti</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500" style={{ background: '#3A3A3C', border: '1px solid rgba(255,255,255,0.1)' }} placeholder="sinä@esimerkki.fi" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-1">Salasana</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500" style={{ background: '#3A3A3C', border: '1px solid rgba(255,255,255,0.1)' }} />
          </div>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <button onClick={handle} disabled={loading} className="w-full py-3.5 rounded-xl text-white font-bold text-sm disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #1B3A6B, #1B2B4B)' }}>
            {loading ? '...' : mode === 'login' ? 'Kirjaudu sisään' : 'Luo tili'}
          </button>
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="w-full text-center text-sm mt-4" style={{ color: '#8E8E93' }}>
            {mode === 'login' ? 'Luo uusi tili' : 'Kirjaudu sisään'}
          </button>
        </div>
      </div>
    </div>
  );
}
