'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/LangContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { t } = useLang();
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
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>Asbestikartoitus</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Analyysi: Onelab</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          {mode === 'register' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">{t('name')}</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500" placeholder="Matti Meikäläinen" />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">{t('email')}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500" placeholder="sinä@esimerkki.fi" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">{t('password')}</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500" />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button onClick={handle} disabled={loading} className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-50" style={{ background: 'var(--accent)' }}>
            {loading ? '...' : mode === 'login' ? t('login') : t('register')}
          </button>
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="w-full text-center text-sm mt-4" style={{ color: 'var(--muted)' }}>
            {mode === 'login' ? t('register') : t('login')}
          </button>
        </div>
      </div>
    </div>
  );
}
