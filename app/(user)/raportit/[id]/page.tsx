'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/LangContext';
import type { Survey, Sample } from '@/lib/supabase';

export default function ReportViewPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLang();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [samples, setSamples] = useState<Sample[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from('surveys').select('*').eq('id', id).single(),
      supabase.from('survey_samples').select('*').eq('survey_id', id).order('created_at'),
    ]).then(([{ data: s }, { data: sm }]) => {
      if (s) setSurvey(s);
      if (sm) setSamples(sm);
    });
  }, [id]);

  if (!survey) return null;

  const asbestosFound = samples.some(s => s.asbestos_detected);

  return (
    <div className="p-4 pt-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/raportit" className="text-xl">←</Link>
        <h1 className="font-bold text-base flex-1">Raportti</h1>
        <button onClick={() => window.print()} className="text-xs px-3 py-1.5 rounded-lg text-white font-medium" style={{ background: 'var(--accent)' }}>PDF</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
        <div className="p-4 text-white" style={{ background: 'var(--primary)' }}>
          <p className="text-xs font-medium opacity-70 mb-0.5">ASBESTIKARTOITUSRAPORTTI</p>
          <h2 className="font-bold text-base">{survey.name}</h2>
          <p className="text-xs opacity-70 mt-0.5">{survey.city} · {new Date(survey.date).toLocaleDateString('fi-FI')}</p>
        </div>
        <div className="p-4">
          <div className={`flex items-center gap-2 p-3 rounded-xl mb-4 ${asbestosFound ? 'bg-red-50' : 'bg-green-50'}`}>
            <span className="text-2xl">{asbestosFound ? '⚠️' : '✅'}</span>
            <p className="font-semibold text-sm">{asbestosFound ? t('asbestosYes') : t('asbestosNo')}</p>
          </div>
          <div className="space-y-3">
            {samples.map((s, i) => (
              <div key={s.id} className="border rounded-xl p-3" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold" style={{ color: 'var(--muted)' }}>{s.sample_code || `N-${String(i+1).padStart(3,'0')}`}</span>
                  <span className={`text-xs font-semibold ${s.asbestos_detected ? 'text-red-600' : 'text-green-600'}`}>
                    {s.asbestos_detected !== null ? (s.asbestos_detected ? t('asbestosYes') : t('asbestosNo')) : '—'}
                  </span>
                </div>
                <p className="text-sm font-medium">{s.location} · {s.material}</p>
                {s.asbestos_type && <p className="text-xs font-semibold text-red-600 mt-0.5">{s.asbestos_type}</p>}
                {s.photo_url && <img src={s.photo_url} alt="" className="mt-2 w-full h-24 object-cover rounded-lg" />}
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-center text-xs" style={{ color: 'var(--muted)' }}>{t('analysisBy')}</p>
    </div>
  );
}
