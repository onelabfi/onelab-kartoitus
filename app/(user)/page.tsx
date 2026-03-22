'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Survey } from '@/lib/supabase';

export default function HomePage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('userName') || '';
    setUserName(name);
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      supabase.from('surveys').select('*').eq('user_id', data.user.id)
        .then(({ data: s }) => { if (s) setSurveys(s); });
    });
  }, []);

  const analyzing = surveys.filter(s => s.status === 'analyzing').length;
  const complete = surveys.filter(s => s.status === 'complete').length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="px-6 pt-12 pb-6 text-center">
        <h1 className="text-5xl font-black text-white tracking-tight mb-2">Kartoittaja</h1>
        <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
          Asbestikartoitustyökalu remonttikohteisiin
        </p>
        {analyzing > 0 && (
          <div className="mt-3 inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-3 py-1">
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-yellow-400 text-xs font-semibold">{analyzing} näytettä analysoinnissa</span>
          </div>
        )}
        {complete > 0 && (
          <div className="mt-2 inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1 ml-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-green-400 text-xs font-semibold">{complete} valmista raporttia</span>
          </div>
        )}
      </div>

      {/* Main menu buttons */}
      <div className="px-4 space-y-3 flex-1">
        <Link href="/kartoitukset/uusi" className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #1B2B4B 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
            🔍
          </div>
          <div className="text-left">
            <p className="text-white font-bold text-lg leading-tight">Uusi Kartoitus</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Aloita uusi näytteiden keruu</p>
          </div>
          <span className="ml-auto text-white/40 text-xl">›</span>
        </Link>

        <Link href="/kartoitukset" className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #2C2C2E 0%, #3A3A3C 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'rgba(255,255,255,0.08)' }}>
            📁
          </div>
          <div className="text-left">
            <p className="text-white font-bold text-lg leading-tight">Omat Kartoitukset</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{surveys.length} kartoitusta</p>
          </div>
          <span className="ml-auto text-white/40 text-xl">›</span>
        </Link>

        <Link href="/raportit" className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #2C2C2E 0%, #3A3A3C 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'rgba(255,255,255,0.08)' }}>
            📄
          </div>
          <div className="text-left">
            <p className="text-white font-bold text-lg leading-tight">Raportit</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{complete} valmista</p>
          </div>
          <span className="ml-auto text-white/40 text-xl">›</span>
        </Link>

        <Link href="/asetukset" className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #2C2C2E 0%, #3A3A3C 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'rgba(255,255,255,0.08)' }}>
            ⚙️
          </div>
          <div className="text-left">
            <p className="text-white font-bold text-lg leading-tight">Ohjeet & Asetukset</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Kieli, profiili</p>
          </div>
          <span className="ml-auto text-white/40 text-xl">›</span>
        </Link>
      </div>

      {/* Photo panels at bottom */}
      <div className="px-4 mt-6 mb-24 grid grid-cols-2 gap-3">
        <div className="relative h-36 rounded-2xl overflow-hidden" style={{ background: '#2C2C2E' }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl mb-1">⚠️</div>
              <p className="text-yellow-400 text-xs font-bold">ASBESTI VAARA</p>
            </div>
          </div>
          <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.15), rgba(0,0,0,0.4))' }} />
        </div>
        <div className="relative h-36 rounded-2xl overflow-hidden" style={{ background: '#2C2C2E' }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl mb-1">🔬</div>
              <p className="text-blue-400 text-xs font-bold">ANALYYSI: ONELAB</p>
            </div>
          </div>
          <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(0,0,0,0.4))' }} />
        </div>
      </div>
    </div>
  );
}
