'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.replace('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl">
        <h1 className="text-xl font-bold mb-6 text-center">Admin</h1>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-xl px-4 py-3 text-sm mb-3 outline-none focus:border-blue-500" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full border rounded-xl px-4 py-3 text-sm mb-4 outline-none focus:border-blue-500" />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button onClick={handle} disabled={loading} className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold disabled:opacity-50">
          {loading ? '...' : 'Kirjaudu'}
        </button>
      </div>
    </div>
  );
}
