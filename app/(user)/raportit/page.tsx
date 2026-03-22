'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/LangContext';
import type { Survey } from '@/lib/supabase';

export default function ReportsPage() {
  const { t } = useLang();
  const [reports, setReports] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      supabase.from('surveys').select('*').eq('user_id', data.user.id).in('status', ['analyzing', 'complete']).order('created_at', { ascending: false })
        .then(({ data: s }) => { if (s) setReports(s); setLoading(false); });
    });
  }, []);

  return (
    <div className="p-4 pt-8">
      <h1 className="text-xl font-bold mb-6" style={{ color: 'var(--primary)' }}>{t('reports')}</h1>
      {loading ? <p className="text-center text-sm py-12" style={{ color: 'var(--muted)' }}>...</p> :
        reports.length === 0 ? <p className="text-center text-sm py-12" style={{ color: 'var(--muted)' }}>{t('noReports')}</p> :
        <div className="space-y-3">
          {reports.map(r => (
            <Link key={r.id} href={r.status === 'complete' ? `/raportit/${r.id}` : '#'} className="block bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm">{r.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{r.city} · {new Date(r.date).toLocaleDateString('fi-FI')}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full text-white`} style={{ background: r.status === 'complete' ? '#10B981' : '#F59E0B' }}>
                  {r.status === 'complete' ? t('complete') : t('analyzing')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      }
      <p className="text-center text-xs mt-8" style={{ color: 'var(--muted)' }}>{t('analysisBy')}</p>
    </div>
  );
}
