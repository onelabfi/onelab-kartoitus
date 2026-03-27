'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/LangContext';
import type { Survey, Sample } from '@/lib/supabase';

export default function SurveyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const justSent = searchParams.get('sent') === '1';
  const justPaid = searchParams.get('paid') === '1';
  const cancelled = searchParams.get('cancelled') === '1';
  const { t } = useLang();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('surveys').select('*').eq('id', id).single(),
      supabase.from('survey_samples').select('*').eq('survey_id', id).order('created_at'),
    ]).then(([{ data: s }, { data: sm }]) => {
      if (s) setSurvey(s);
      if (sm) setSamples(sm);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-8 text-center text-sm" style={{ color: 'var(--muted)' }}>...</div>;
  if (!survey) return null;

  const statusColors: Record<string, string> = { draft: '#6B7280', pending_payment: '#F59E0B', submitted: '#2563EB', analyzing: '#F59E0B', complete: '#10B981' };
  const statusLabels: Record<string, string> = { draft: 'Luonnos', pending_payment: 'Odottaa maksua', submitted: 'Lähetetty', analyzing: 'Analysoinnissa', complete: 'Valmis' };

  return (
    <div className="p-4 pt-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/kartoitukset" className="text-xl">←</Link>
        <div className="flex-1">
          <h1 className="font-bold text-base">{survey.name}</h1>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>{survey.city} · {new Date(survey.date).toLocaleDateString('fi-FI')}</p>
        </div>
        <span className="text-xs font-semibold px-2 py-1 rounded-full text-white" style={{ background: statusColors[survey.status] }}>
          {statusLabels[survey.status]}
        </span>
      </div>

      {(justSent || justPaid) && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4 text-center">
          <p className="text-green-700 font-semibold text-sm">✓ Maksu vastaanotettu — kartoitus lähetetty!</p>
          <p className="text-green-600 text-xs mt-1">Näytteet toimita laboratorioon. Saat ilmoituksen kun analyysi on valmis.</p>
        </div>
      )}

      {cancelled && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 text-center">
          <p className="text-red-700 font-semibold text-sm">Kartoitus keskeytetty</p>
          <p className="text-red-600 text-xs mt-1">Maksu peruutettiin. Kartoitustietosi on tallennettu — voit yrittää maksua uudelleen.</p>
          <button
            onClick={async () => {
              const { data: { session } } = await supabase.auth.getSession();
              const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
                body: JSON.stringify({ surveyId: id, sampleCount: samples.length, surveyAddress: survey.name }),
              });
              const { url } = await res.json();
              if (url) window.location.href = url;
            }}
            className="mt-3 px-4 py-2 rounded-xl text-white text-sm font-semibold"
            style={{ background: '#2563EB' }}
          >
            Yritä uudelleen →
          </button>
        </div>
      )}

      <div className="space-y-3">
        {samples.map((s, i) => (
          <div key={s.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: 'var(--primary)' }}>{s.sample_code || `N-${String(i+1).padStart(3,'0')}`}</span>
              {s.asbestos_detected !== null && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.asbestos_detected ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {s.asbestos_detected ? t('asbestosYes') : t('asbestosNo')}
                </span>
              )}
            </div>
            <p className="text-sm font-medium">{s.location} · {s.material}</p>
            {s.description && <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{s.description}</p>}
            {s.asbestos_type && <p className="text-xs mt-1 font-medium text-red-600">{s.asbestos_type}</p>}
            {(s.photo_url || s.bag_photo_url) && (
              <div className={`mt-2 grid gap-2 ${s.photo_url && s.bag_photo_url ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {s.photo_url && <div><p className="text-[10px] mb-0.5" style={{ color: 'var(--muted)' }}>Kohde</p><img src={s.photo_url} alt="" className="w-full h-28 object-cover rounded-xl" /></div>}
                {s.bag_photo_url && <div><p className="text-[10px] mb-0.5" style={{ color: 'var(--muted)' }}>Pussi</p><img src={s.bag_photo_url} alt="" className="w-full h-28 object-cover rounded-xl" /></div>}
              </div>
            )}
          </div>
        ))}
      </div>

      {survey.status === 'complete' && (
        <Link href={`/raportit/${id}`} className="flex items-center justify-center mt-6 py-4 rounded-2xl text-white font-semibold" style={{ background: '#10B981' }}>
          📄 {t('reports')} →
        </Link>
      )}
    </div>
  );
}
