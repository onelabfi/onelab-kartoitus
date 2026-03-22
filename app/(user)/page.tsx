'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/LangContext';
import { useAuth } from '@/lib/AuthContext';
import type { Survey } from '@/lib/supabase';

export default function HomePage() {
  const { t } = useLang();
  const { userName } = useAuth();
  const [surveys, setSurveys] = useState<Survey[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      supabase.from('surveys').select('*').eq('user_id', data.user.id).then(({ data: s }) => {
        if (s) setSurveys(s);
      });
    });
  }, []);

  const active = surveys.filter(s => ['draft', 'submitted'].includes(s.status)).length;
  const analyzing = surveys.filter(s => s.status === 'analyzing').length;
  const complete = surveys.filter(s => s.status === 'complete').length;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('greeting') : hour < 18 ? 'Hyvää päivää' : 'Hyvää iltaa';

  return (
    <div className="p-4 pt-8">
      {/* Header */}
      <div className="mb-6">
        <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>{greeting}{userName ? `, ${userName}` : ''}</p>
        <h1 className="text-2xl font-bold mt-0.5" style={{ color: 'var(--primary)' }}>Asbestikartoitus</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label={t('activeSurveys')} value={active} color="#2563EB" />
        <StatCard label={t('waitingResults')} value={analyzing} color="#F59E0B" />
        <StatCard label={t('readyReports')} value={complete} color="#10B981" />
      </div>

      {/* CTA */}
      <Link href="/kartoitukset/uusi" className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-white font-semibold text-base shadow-sm" style={{ background: 'var(--accent)' }}>
        <span className="text-xl">+</span> {t('newSurvey')}
      </Link>

      {/* Recent */}
      {surveys.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--muted)' }}>Viimeisimmät</h2>
          <div className="space-y-2">
            {surveys.slice(0, 3).map(s => (
              <Link key={s.id} href={`/kartoitukset/${s.id}`} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
                <div>
                  <p className="font-medium text-sm">{s.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{s.city} · {new Date(s.date).toLocaleDateString('fi-FI')}</p>
                </div>
                <StatusBadge status={s.status} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Analyysi footer */}
      <p className="text-center text-xs mt-8" style={{ color: 'var(--muted)' }}>{t('analysisBy')}</p>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm text-center">
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      <p className="text-[10px] mt-0.5 leading-tight" style={{ color: 'var(--muted)' }}>{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    draft: '#6B7280',
    submitted: '#2563EB',
    analyzing: '#F59E0B',
    complete: '#10B981',
  };
  const labels: Record<string, string> = {
    draft: 'Luonnos',
    submitted: 'Lähetetty',
    analyzing: 'Analysoinnissa',
    complete: 'Valmis',
  };
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: colors[status] || '#6B7280' }}>
      {labels[status] || status}
    </span>
  );
}
