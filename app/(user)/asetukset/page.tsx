'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/LangContext';
import { useRouter } from 'next/navigation';
import type { Lang } from '@/lib/i18n';

export default function SettingsPage() {
  const { lang, setLang } = useLang();
  const router = useRouter();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(localStorage.getItem('userName') || '');
    setCompany(localStorage.getItem('company') || '');
  }, []);

  const save = () => {
    localStorage.setItem('userName', name);
    localStorage.setItem('company', company);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  const langs: { code: Lang; label: string }[] = [
    { code: 'fi', label: 'Suomi' },
    { code: 'en', label: 'English' },
    { code: 'sv', label: 'Svenska' },
  ];

  const cardStyle = { background: '#2C2C2E', border: '1px solid rgba(255,255,255,0.08)' };
  const inputStyle = { background: '#3A3A3C', border: '1px solid rgba(255,255,255,0.1)' };
  const btnActive = { borderColor: '#2563EB', color: '#2563EB', background: 'rgba(37,99,235,0.15)' };
  const btnInactive = { borderColor: 'rgba(255,255,255,0.1)', color: '#8E8E93', background: 'transparent' };

  return (
    <div className="p-4 pt-8" style={{ background: '#1C1C1E', minHeight: '100vh' }}>
      <h1 className="text-2xl font-black text-white mb-6">Asetukset</h1>

      <div className="space-y-4">
        <div className="rounded-2xl p-4" style={cardStyle}>
          <p className="text-xs font-bold mb-3" style={{ color: '#8E8E93' }}>KIELI</p>
          <div className="flex gap-2">
            {langs.map(l => (
              <button key={l.code} onClick={() => setLang(l.code)} className="flex-1 py-2 rounded-xl text-sm font-bold border transition-colors" style={lang === l.code ? btnActive : btnInactive}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-4" style={cardStyle}>
          <p className="text-xs font-bold mb-3" style={{ color: '#8E8E93' }}>PROFIILI</p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Nimi</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Yritys (valinnainen)</label>
              <input value={company} onChange={e => setCompany(e.target.value)} className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none" style={inputStyle} />
            </div>
            <button onClick={save} className="w-full py-3 rounded-xl text-white text-sm font-bold" style={{ background: saved ? '#10B981' : 'linear-gradient(135deg, #1B3A6B, #1B2B4B)' }}>
              {saved ? '✓ Tallennettu' : 'Tallenna'}
            </button>
          </div>
        </div>

        <button onClick={logout} className="w-full py-3 rounded-xl text-sm font-bold border" style={{ borderColor: 'rgba(239,68,68,0.4)', color: '#EF4444', background: 'rgba(239,68,68,0.08)' }}>
          Kirjaudu ulos
        </button>

        <p className="text-center text-xs mt-4" style={{ color: '#8E8E93' }}>Analyysi: Onelab</p>
      </div>
    </div>
  );
}
