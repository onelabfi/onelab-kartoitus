'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/LangContext';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import type { Lang } from '@/lib/i18n';

export default function SettingsPage() {
  const { t, lang, setLang } = useLang();
  const { userName, setUserName } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(userName);
  const [company, setCompany] = useState(typeof window !== 'undefined' ? localStorage.getItem('company') || '' : '');
  const [saved, setSaved] = useState(false);

  const save = () => {
    setUserName(name);
    if (typeof window !== 'undefined') localStorage.setItem('company', company);
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

  return (
    <div className="p-4 pt-8">
      <h1 className="text-xl font-bold mb-6" style={{ color: 'var(--primary)' }}>{t('settings')}</h1>

      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-semibold mb-3" style={{ color: 'var(--muted)' }}>{t('language').toUpperCase()}</p>
          <div className="flex gap-2">
            {langs.map(l => (
              <button key={l.code} onClick={() => setLang(l.code)} className="flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors" style={{ borderColor: lang === l.code ? 'var(--accent)' : 'var(--border)', color: lang === l.code ? 'var(--accent)' : 'var(--muted)', background: lang === l.code ? '#EFF6FF' : 'white' }}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-semibold mb-3" style={{ color: 'var(--muted)' }}>PROFIILI</p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">{t('userName')}</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500" style={{ borderColor: 'var(--border)' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('companyName')}</label>
              <input value={company} onChange={e => setCompany(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500" style={{ borderColor: 'var(--border)' }} />
            </div>
            <button onClick={save} className="w-full py-3 rounded-xl text-white text-sm font-semibold" style={{ background: saved ? '#10B981' : 'var(--accent)' }}>
              {saved ? '✓ Tallennettu' : t('save')}
            </button>
          </div>
        </div>

        <button onClick={logout} className="w-full py-3 rounded-xl text-sm font-semibold border" style={{ borderColor: '#EF4444', color: '#EF4444' }}>
          {t('logout')}
        </button>
      </div>
      <p className="text-center text-xs mt-8" style={{ color: 'var(--muted)' }}>{t('analysisBy')}</p>
    </div>
  );
}
