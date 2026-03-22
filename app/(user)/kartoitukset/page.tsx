'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/LangContext';
import type { Survey } from '@/lib/supabase';

export default function SurveysPage() {
  const { t } = useLang();
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
    draft: '#6B7280', submitted: '#2563EB', analyzing: '#F59E0B', complete: '#10B981',
  };
  const statusLabels: Record<string, string> = {
    draft: 'Luonnos', submitted: 'Lähetetty', analyzing: 'Analysoinnissa', complete: 'Valmis',
  };

  return (
    <div className="p-4 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>{t('surveys')}</h1>
        <Link href="/kartoitukset/uusi" className="px-4 py-2 rounded-xl text-white text-sm font-semibold" style={{ background: 'var(--accent)' }}>+ {t('newSurvey')}</Link>
      </div>
      {loading ? <p className="text-center text-sm py-12" style={{ color: 'var(--muted)' }}>...</p> :
        surveys.length === 0 ? <p className="text-center text-sm py-12" style={{ color: 'var(--muted)' }}>{t('noSurveys')}</p> :
        <div className="space-y-3">
          {surveys.map(s => (
            <Link key={s.id} href={`/kartoitukset/${s.id}`} className="block bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm">{s.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{s.city} · {new Date(s.date).toLocaleDateString('fi-FI')}</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: statusColors[s.status] }}>
                  {statusLabels[s.status]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      }
    </div>
  );
}
