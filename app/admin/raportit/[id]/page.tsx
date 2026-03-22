'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Survey, Sample } from '@/lib/supabase';

const ASBESTOS_TYPES = ['Krysotiili', 'Antofylliitti', 'Amosiitti', 'Krokidoliitti', 'Tremoliitti', 'Aktinoliitti'];

export default function AdminSurveyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from('surveys').select('*').eq('id', id).single(),
      supabase.from('survey_samples').select('*').eq('survey_id', id).order('created_at'),
    ]).then(([{ data: s }, { data: sm }]) => {
      if (s) setSurvey(s);
      if (sm) setSamples(sm);
    });
  }, [id]);

  const updateSample = (sampleId: string, field: keyof Sample, value: boolean | string | number | null) =>
    setSamples(prev => prev.map(s => s.id === sampleId ? { ...s, [field]: value } : s));

  const save = async () => {
    setSaving(true);
    for (const s of samples) {
      await supabase.from('survey_samples').update({
        asbestos_detected: s.asbestos_detected,
        asbestos_type: s.asbestos_type,
        lab_notes: s.lab_notes,
        polyavyys: s.polyavyys ?? null,
      }).eq('id', s.id);
    }
    await supabase.from('surveys').update({ status: 'analyzing' }).eq('id', id);
    if (survey) setSurvey({ ...survey, status: 'analyzing' });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!survey) return <div className="p-8 text-center text-gray-400">Ladataan...</div>;

  const statusColors: Record<string, string> = {
    draft: '#6B7280',
    submitted: '#2563EB',
    analyzing: '#F59E0B',
    complete: '#10B981',
  };
  const statusLabels: Record<string, string> = {
    draft: 'Luonnos',
    submitted: 'Lähetetty',
    analyzing: 'Analysoinnissa',
    complete: 'Valmis',
  };
  const allResultsIn = samples.length > 0 && samples.every(s => s.asbestos_detected !== null);

  return (
    <div className="p-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 flex items-center gap-1"
          >
            ← Takaisin
          </button>
          <h1 className="text-xl font-bold text-gray-900">{survey.name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {survey.city} · {new Date(survey.date).toLocaleDateString('fi-FI')}
          </p>
          {survey.kohde_tyyppi && (
            <p className="text-xs text-gray-400 mt-0.5">
              {survey.kohde_tyyppi}
              {survey.katto ? ` · Katto: ${survey.katto}` : ''}
              {survey.runko ? ` · Runko: ${survey.runko}` : ''}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
            style={{ background: statusColors[survey.status] }}
          >
            {statusLabels[survey.status]}
          </span>
          <div className="flex gap-2">
            <button
              onClick={save}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-50"
            >
              {saving ? '...' : saved ? '✓ Tallennettu' : 'Tallenna tulokset'}
            </button>
            {allResultsIn && (
              <button
                onClick={async () => { await save(); router.push(`/admin/raportit/${id}/report`); }}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold disabled:opacity-50"
              >
                Avaa raportti →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Samples */}
      <div className="space-y-4">
        {samples.map((s, i) => {
          const locationStr = [s.location, s.sub_location].filter(Boolean).join(' · ');
          const materialStr = s.materials?.length ? s.materials.join(', ') : s.material;
          return (
            <div key={s.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="font-bold text-sm text-gray-900">
                    {s.sample_code || `N-${String(i + 1).padStart(3, '0')}`}
                  </span>
                  <span className="text-gray-500 text-sm ml-2">{locationStr}</span>
                  {materialStr && (
                    <span className="text-gray-400 text-sm ml-1">· {materialStr}</span>
                  )}
                  {s.area_m2 != null && (
                    <span className="text-gray-400 text-xs ml-1">· {s.area_m2} m²</span>
                  )}
                </div>
                {s.asbestos_detected !== null && (
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      s.asbestos_detected
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {s.asbestos_detected ? '⚠ Asbestia' : '✓ Puhdas'}
                  </span>
                )}
              </div>

              {s.photo_url && (
                <img
                  src={s.photo_url}
                  alt=""
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              )}
              {s.description && (
                <p className="text-sm text-gray-500 mb-3 italic">{s.description}</p>
              )}

              {/* Result buttons */}
              <div className="border-t border-gray-100 pt-3 space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => updateSample(s.id, 'asbestos_detected', false)}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold border-2 transition-colors"
                    style={{
                      borderColor: s.asbestos_detected === false ? '#10B981' : '#E5E7EB',
                      color: s.asbestos_detected === false ? '#10B981' : '#6B7280',
                      background: s.asbestos_detected === false ? '#F0FDF4' : 'white',
                    }}
                  >
                    ✓ Ei asbestia
                  </button>
                  <button
                    onClick={() => updateSample(s.id, 'asbestos_detected', true)}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold border-2 transition-colors"
                    style={{
                      borderColor: s.asbestos_detected === true ? '#EF4444' : '#E5E7EB',
                      color: s.asbestos_detected === true ? '#EF4444' : '#6B7280',
                      background: s.asbestos_detected === true ? '#FEF2F2' : 'white',
                    }}
                  >
                    ⚠ Sisältää asbestia
                  </button>
                </div>
                {s.asbestos_detected && (
                  <select
                    value={s.asbestos_type || ''}
                    onChange={e => updateSample(s.id, 'asbestos_type', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                    style={{ color: '#1C1C1E', background: 'white' }}
                  >
                    <option value="">Valitse asbestityyppi...</option>
                    {ASBESTOS_TYPES.map(t => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                )}
                {/* Pölyävyys 1-5 */}
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1.5">
                    Pölyävyys <span className="font-normal">(1 = ehjä · 5 = erittäin pölyävä)</span>
                  </p>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        onClick={() => updateSample(s.id, 'polyavyys', n)}
                        className="flex-1 py-2 rounded-lg text-sm font-bold border-2 transition-colors"
                        style={{
                          borderColor: s.polyavyys === n ? '#2563EB' : '#E5E7EB',
                          background: s.polyavyys === n ? '#EFF6FF' : 'white',
                          color: s.polyavyys === n ? '#2563EB' : '#374151',
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={s.lab_notes || ''}
                  onChange={e => updateSample(s.id, 'lab_notes', e.target.value)}
                  rows={2}
                  placeholder="Laboratoriomuistiinpanot (valinnainen)..."
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none border-gray-200"
                  style={{ color: '#1C1C1E', background: 'white' }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {!allResultsIn && samples.length > 0 && (
        <p className="text-center text-sm text-gray-400 mt-4">
          Syötä kaikkien {samples.length} näytteen tulokset ennen raportin luomista.
        </p>
      )}
    </div>
  );
}
