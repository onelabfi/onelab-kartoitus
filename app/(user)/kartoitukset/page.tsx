'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Survey } from '@/lib/supabase';

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      supabase.from('surveys').select('*').eq('user_id', data.user.id).order('created_at', { ascending: false })
        .then(({ data: s }) => { if (s) setSurveys(s); setLoading(false); });
    });
  }, []);

  const statusColors: Record<string, string> = {
    draft: '#8E8E93', submitted: '#2563EB', analyzing: '#F59E0B', complete: '#10B981',
  };
  const statusLabels: Record<string, string> = {
    draft: 'Luonnos', submitted: 'Lähetetty', analyzing: 'Analysoinnissa', complete: 'Valmis',
  };

  return (
    <div className="p-4 pt-8" style={{ background: '#1C1C1E', minHeight: '100vh' }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white">Kartoitukset</h1>
        <Link href="/kartoitukset/uusi" className="px-4 py-2 rounded-xl text-white text-sm font-bold" style={{ background: '#1B2B4B', border: '1px solid rgba(255,255,255,0.1)' }}>
          + Uusi
        </Link>
      </div>
      {loading ? (
        <p className="text-center text-sm py-12" style={{ color: '#8E8E93' }}>...</p>
      ) : surveys.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-white font-semibold">Ei kartoituksia vielä</p>
          <p className="text-sm mt-1" style={{ color: '#8E8E93' }}>Aloita uusi kartoitus</p>
          <Link href="/kartoitukset/uusi" className="inline-block mt-4 px-6 py-3 rounded-xl text-white font-bold" style={{ background: '#1B2B4B' }}>
            Uusi Kartoitus
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {surveys.map(s => (
            <Link key={s.id} href={`/kartoitukset/${s.id}`} className="block rounded-2xl p-4 transition-all active:scale-95" style={{ background: '#2C2C2E', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-white text-sm">{s.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#8E8E93' }}>{s.city} · {new Date(s.date).toLocaleDateString('fi-FI')}</p>
                  {s.kohde_tyyppi && <p className="text-xs mt-0.5" style={{ color: '#8E8E93' }}>{s.kohde_tyyppi}</p>}
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: statusColors[s.status] }}>
                  {statusLabels[s.status]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
