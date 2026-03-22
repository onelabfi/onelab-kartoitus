'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Survey, Sample } from '@/lib/supabase';

const ASBESTOS_TYPES = ['Krysotiili', 'Antofylliitti', 'Amosiitti', 'Krokidoliitti', 'Tremoliitti', 'Aktinoliitti'];

export default function AdminSurveyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from('surveys').select('*').eq('id', id).single(),
      supabase.from('survey_samples').select('*').eq('survey_id', id).order('created_at'),
    ]).then(([{ data: s }, { data: sm }]) => {
      if (s) setSurvey(s);
      if (sm) setSamples(sm);
    });
  }, [id]);

  const updateSample = (sampleId: string, field: keyof Sample, value: boolean | string | null) => {
    setSamples(prev => prev.map(s => s.id === sampleId ? { ...s, [field]: value } : s));
  };

  const save = async () => {
    setSaving(true);
    for (const s of samples) {
      await supabase.from('survey_samples').update({
        asbestos_detected: s.asbestos_detected,
        asbestos_type: s.asbestos_type,
        lab_notes: s.lab_notes,
      }).eq('id', s.id);
    }
    await supabase.from('surveys').update({ status: 'analyzing' }).eq('id', id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sendReport = async () => {
    setSending(true);
    await supabase.from('surveys').update({ status: 'complete' }).eq('id', id);
    setSending(false);
    setSent(true);
    if (survey) setSurvey({ ...survey, status: 'complete' });
  };

  if (!survey) return <div className="p-8 text-center text-gray-400">...</div>;

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{survey.name}</h1>
          <p className="text-sm text-gray-500">{survey.city} · {new Date(survey.date).toLocaleDateString('fi-FI')}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={save} disabled={saving} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-50">
            {saving ? '...' : saved ? '✓ Tallennettu' : 'Tallenna'}
          </button>
          <button onClick={sendReport} disabled={sending || sent} className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold disabled:opacity-50">
            {sent ? '✓ Lähetetty' : sending ? '...' : 'Lähetä raportti'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {samples.map((s, i) => (
          <div key={s.id} className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm">{s.sample_code || `N-${String(i+1).padStart(3,'0')}`}</span>
              <span className="text-sm text-gray-500">{s.location} · {s.material}</span>
            </div>
            {s.photo_url && <img src={s.photo_url} alt="" className="w-full h-40 object-cover rounded-lg mb-3" />}
            {s.description && <p className="text-sm text-gray-500 mb-3">{s.description}</p>}
            {/* Results */}
            <div className="border-t pt-3 space-y-3" style={{ borderColor: '#E5E7EB' }}>
              <div className="flex gap-2">
                <button onClick={() => updateSample(s.id, 'asbestos_detected', false)} className="flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors" style={{ borderColor: s.asbestos_detected === false ? '#10B981' : '#E5E7EB', color: s.asbestos_detected === false ? '#10B981' : '#6B7280', background: s.asbestos_detected === false ? '#F0FDF4' : 'white' }}>
                  ✓ Ei asbestia
                </button>
                <button onClick={() => updateSample(s.id, 'asbestos_detected', true)} className="flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors" style={{ borderColor: s.asbestos_detected === true ? '#EF4444' : '#E5E7EB', color: s.asbestos_detected === true ? '#EF4444' : '#6B7280', background: s.asbestos_detected === true ? '#FEF2F2' : 'white' }}>
                  ⚠ Asbestia
                </button>
              </div>
              {s.asbestos_detected && (
                <select value={s.asbestos_type || ''} onChange={e => updateSample(s.id, 'asbestos_type', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" style={{ borderColor: '#E5E7EB' }}>
                  <option value="">Valitse tyyppi...</option>
                  {ASBESTOS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              )}
              <textarea value={s.lab_notes || ''} onChange={e => updateSample(s.id, 'lab_notes', e.target.value)} rows={2} placeholder="Laboratoriomuistiinpanot..." className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none" style={{ borderColor: '#E5E7EB' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
