'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/LangContext';

type SampleDraft = {
  id: string;
  location: string;
  material: string;
  description: string;
  photo: File | null;
  photoPreview: string | null;
  sample_code: string;
};

const LOCATIONS = ['Keittiö', 'WC', 'Kylpyhuone', 'Makuuhuone', 'Olohuone', 'Kellari', 'Ullakko', 'Piha', 'Muu'];
const MATERIALS = ['Laatta', 'Liima', 'Levy', 'Putki', 'Eristys', 'Matto', 'Tasoite', 'Muu'];

function generateCode(index: number) {
  return `N-${String(index + 1).padStart(3, '0')}`;
}

export default function NewSurveyPage() {
  const { t } = useLang();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [samples, setSamples] = useState<SampleDraft[]>([]);
  const [saving, setSaving] = useState(false);

  const addSample = () => {
    setSamples(prev => [...prev, {
      id: crypto.randomUUID(),
      location: '',
      material: '',
      description: '',
      photo: null,
      photoPreview: null,
      sample_code: generateCode(prev.length),
    }]);
  };

  const updateSample = (id: string, field: keyof SampleDraft, value: string | File | null) => {
    setSamples(prev => prev.map(s => {
      if (s.id !== id) return s;
      if (field === 'photo' && value instanceof File) {
        const url = URL.createObjectURL(value);
        return { ...s, photo: value, photoPreview: url };
      }
      return { ...s, [field]: value };
    }));
  };

  const removeSample = (id: string) => {
    setSamples(prev => prev.filter(s => s.id !== id).map((s, i) => ({ ...s, sample_code: generateCode(i) })));
  };

  const handleSubmit = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: survey, error } = await supabase.from('surveys').insert({
      user_id: user.id, name, city, date, status: 'submitted',
    }).select().single();

    if (error || !survey) { setSaving(false); return; }

    for (const s of samples) {
      let photoUrl = null;
      if (s.photo) {
        const path = `${survey.id}/${s.id}`;
        const { error: upErr } = await supabase.storage.from('sample-photos').upload(path, s.photo);
        if (!upErr) {
          const { data: urlData } = supabase.storage.from('sample-photos').getPublicUrl(path);
          photoUrl = urlData.publicUrl;
        }
      }
      await supabase.from('samples').insert({
        survey_id: survey.id, sample_code: s.sample_code, location: s.location,
        material: s.material, description: s.description || null, photo_url: photoUrl,
      });
    }
    router.push(`/kartoitukset/${survey.id}?sent=1`);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center gap-3" style={{ borderColor: 'var(--border)' }}>
        <button onClick={() => step > 1 ? setStep(step - 1) : router.back()} className="text-xl">←</button>
        <div className="flex-1">
          <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Vaihe {step}/3</p>
          <p className="text-sm font-bold">{step === 1 ? t('step1') : step === 2 ? t('step2') : t('step3')}</p>
        </div>
        {/* Step dots */}
        <div className="flex gap-1">
          {[1,2,3].map(i => (
            <div key={i} className="w-2 h-2 rounded-full transition-colors" style={{ background: i <= step ? 'var(--accent)' : 'var(--border)' }} />
          ))}
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto">
        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <Field label={t('targetName')} value={name} onChange={setName} placeholder="esim. Tehtaankatu 12" />
            <Field label={t('city')} value={city} onChange={setCity} placeholder="esim. Helsinki" />
            <div>
              <label className="block text-sm font-medium mb-1">{t('date')}</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 bg-white" style={{ borderColor: 'var(--border)' }} />
            </div>
            <button onClick={() => setStep(2)} disabled={!name || !city} className="w-full py-4 rounded-2xl text-white font-semibold mt-4 disabled:opacity-40" style={{ background: 'var(--accent)' }}>
              {t('next')} →
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <div className="space-y-4 mb-4">
              {samples.map((s) => (
                <div key={s.id} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: 'var(--primary)' }}>{s.sample_code}</span>
                    <button onClick={() => removeSample(s.id)} className="text-red-400 text-sm">✕</button>
                  </div>
                  {/* Location buttons */}
                  <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('location')}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {LOCATIONS.map(loc => (
                      <button key={loc} onClick={() => updateSample(s.id, 'location', loc)} className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors" style={{ borderColor: s.location === loc ? 'var(--accent)' : 'var(--border)', color: s.location === loc ? 'var(--accent)' : 'var(--primary)', background: s.location === loc ? '#EFF6FF' : 'white' }}>
                        {loc}
                      </button>
                    ))}
                  </div>
                  {/* Material buttons */}
                  <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('material')}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {MATERIALS.map(mat => (
                      <button key={mat} onClick={() => updateSample(s.id, 'material', mat)} className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors" style={{ borderColor: s.material === mat ? 'var(--accent)' : 'var(--border)', color: s.material === mat ? 'var(--accent)' : 'var(--primary)', background: s.material === mat ? '#EFF6FF' : 'white' }}>
                        {mat}
                      </button>
                    ))}
                  </div>
                  {/* Description */}
                  <textarea value={s.description} onChange={e => updateSample(s.id, 'description', e.target.value)} rows={2} placeholder={t('description')} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none mb-3" style={{ borderColor: 'var(--border)' }} />
                  {/* Photo */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="flex-1 border rounded-xl px-3 py-2 text-sm text-center" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
                      {s.photoPreview ? '✓ Kuva lisätty' : `📷 ${t('photo')}`}
                    </div>
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={e => { if (e.target.files?.[0]) updateSample(s.id, 'photo', e.target.files[0]); }} />
                  </label>
                  {s.photoPreview && <img src={s.photoPreview} alt="" className="mt-2 w-full h-32 object-cover rounded-xl" />}
                </div>
              ))}
            </div>
            <button onClick={addSample} className="w-full py-3 rounded-2xl border-2 border-dashed text-sm font-semibold mb-4" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
              {t('addSample')}
            </button>
            <button onClick={() => setStep(3)} disabled={samples.length === 0} className="w-full py-4 rounded-2xl text-white font-semibold disabled:opacity-40" style={{ background: 'var(--accent)' }}>
              {t('next')} →
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-4 text-center">
              <div className="text-4xl mb-3">📦</div>
              <h2 className="font-bold text-base mb-2">{t('step3')}</h2>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{t('sendingInstruction')}</p>
            </div>
            {/* Summary */}
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <p className="text-xs font-semibold mb-3" style={{ color: 'var(--muted)' }}>YHTEENVETO</p>
              <p className="text-sm font-medium">{name}</p>
              <p className="text-xs mt-0.5 mb-3" style={{ color: 'var(--muted)' }}>{city} · {new Date(date).toLocaleDateString('fi-FI')}</p>
              {samples.map(s => (
                <div key={s.id} className="flex items-center justify-between py-2 border-t text-sm" style={{ borderColor: 'var(--border)' }}>
                  <span className="font-medium text-xs" style={{ color: 'var(--muted)' }}>{s.sample_code}</span>
                  <span>{s.location} · {s.material}</span>
                </div>
              ))}
            </div>
            <button onClick={handleSubmit} disabled={saving} className="w-full py-4 rounded-2xl text-white font-semibold disabled:opacity-50" style={{ background: '#10B981' }}>
              {saving ? '...' : t('sendSurvey')} ✓
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 bg-white" style={{ borderColor: 'var(--border)' }} />
    </div>
  );
}
