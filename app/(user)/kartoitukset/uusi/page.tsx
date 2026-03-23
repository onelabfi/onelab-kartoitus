'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type SampleDraft = {
  id: string;
  sample_code: string;
  location: string;
  location_muu: string;
  sub_location: string;
  sub_location_muu: string;
  materials: string[];
  material_muu: string;
  area_m2: string;
  notes: string;
  photo: File | null;
  photoPreview: string | null;
  bagPhoto: File | null;
  bagPhotoPreview: string | null;
};

const LOCATIONS = ['Keittiö', 'KPH', 'WC', 'MH', 'OH', 'Eteinen', 'Kellari', 'Ullakko', 'Katto', 'Sauna', 'Julkisivu', 'Muu'];
const MATERIALS = ['Matto', 'Liima', 'Laatta', 'Laasti', 'Levy', 'Eriste', 'Putkieriste', 'Tasoite', 'Muu'];

function genCode(i: number) { return `N-${String(i + 1).padStart(3, '0')}`; }

function AddressInput({ value, onChange, onCityChange }: { value: string; onChange: (v: string) => void; onCityChange: (c: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current || typeof window === 'undefined') return;
    const loadScript = () => {
      if ((window as any).google?.maps?.places) {
        initAC();
        return;
      }
      const s = document.createElement('script');
      s.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      s.async = true;
      s.onload = initAC;
      document.head.appendChild(s);
    };
    const initAC = () => {
      if (!inputRef.current) return;
      const ac = new (window as any).google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'fi' },
      });
      ac.addListener('place_changed', () => {
        const place = ac.getPlace();
        if (!place.formatted_address) return;
        onChange(place.formatted_address);
        // Extract city
        const cityComp = place.address_components?.find((c: any) => c.types.includes('locality'));
        if (cityComp) onCityChange(cityComp.long_name);
      });
    };
    loadScript();
  }, []);

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="esim. Tehtaankatu 12, Helsinki"
      className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 bg-white"
      style={{ borderColor: 'var(--border)' }}
    />
  );
}

export default function UusiKartoitusPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [tilaajaNimi, setTilaajaNimi] = useState('');
  const [nimiError, setNimiError] = useState('');
  const [tilaajaSahkoposti, setTilaajaSahkoposti] = useState('');
  const [emailError, setEmailError] = useState('');
  const [tilaajaPuhelin, setTilaajaPuhelin] = useState('');
  const [kohde_tyyppi, setKohdeTyyppi] = useState('');
  const [kohde_muu, setKohdeMuu] = useState('');
  const [katto, setKatto] = useState('');
  const [runko, setRunko] = useState('');

  // Step 2
  const [samples, setSamples] = useState<SampleDraft[]>([]);
  const [saving, setSaving] = useState(false);

  const addSample = () => setSamples(prev => [...prev, {
    id: crypto.randomUUID(),
    sample_code: genCode(prev.length),
    location: '', location_muu: '',
    sub_location: '', sub_location_muu: '',
    materials: [], material_muu: '',
    area_m2: '', notes: '',
    photo: null, photoPreview: null,
    bagPhoto: null, bagPhotoPreview: null,
  }]);

  const updateSample = (id: string, updates: Partial<SampleDraft>) =>
    setSamples(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));

  const toggleMaterial = (sampleId: string, mat: string) => {
    setSamples(prev => prev.map(s => {
      if (s.id !== sampleId) return s;
      const has = s.materials.includes(mat);
      return { ...s, materials: has ? s.materials.filter(m => m !== mat) : [...s.materials, mat] };
    }));
  };

  const removeSample = (id: string) =>
    setSamples(prev => prev.filter(s => s.id !== id).map((s, i) => ({ ...s, sample_code: genCode(i) })));

  const handlePhoto = (id: string, file: File) => {
    const url = URL.createObjectURL(file);
    updateSample(id, { photo: file, photoPreview: url });
  };

  const handleBagPhoto = (id: string, file: File) => {
    const url = URL.createObjectURL(file);
    updateSample(id, { bagPhoto: file, bagPhotoPreview: url });
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setSaving(false); return; }

      const { data: survey, error } = await supabase.from('surveys').insert({
        user_id: user.id,
        name: address,
        city: city || address,
        date,
        status: 'pending_payment',
        tilaaja_nimi: tilaajaNimi,
        tilaaja_email: tilaajaSahkoposti,
        tilaaja_puhelin: tilaajaPuhelin || null,
        kohde_tyyppi: kohde_tyyppi === 'Muu' ? kohde_muu : kohde_tyyppi,
        kohde_muu,
        katto,
        runko,
      }).select().single();

      if (error || !survey) {
        console.error('Survey insert error:', error);
        alert('Tallennus epäonnistui: ' + (error?.message || 'tuntematon virhe'));
        setSaving(false);
        return;
      }

      for (const s of samples) {
        let photo_url = null;
        let bag_photo_url = null;
        if (s.photo) {
          try {
            const path = `${survey.id}/${s.id}`;
            const { error: upErr } = await supabase.storage.from('sample-photos').upload(path, s.photo);
            if (!upErr) {
              const { data: u } = supabase.storage.from('sample-photos').getPublicUrl(path);
              photo_url = u.publicUrl;
            }
          } catch {
            // photo upload failed — continue without photo
          }
        }
        if (s.bagPhoto) {
          try {
            const path = `${survey.id}/${s.id}-bag`;
            const { error: upErr } = await supabase.storage.from('sample-photos').upload(path, s.bagPhoto);
            if (!upErr) {
              const { data: u } = supabase.storage.from('sample-photos').getPublicUrl(path);
              bag_photo_url = u.publicUrl;
            }
          } catch {
            // bag photo upload failed — continue without
          }
        }
        const materialStr = s.materials.filter(m => m !== 'Muu').join(', ') + (s.material_muu ? `, ${s.material_muu}` : '');
        await supabase.from('survey_samples').insert({
          survey_id: survey.id,
          sample_code: s.sample_code,
          location: s.location === 'Muu' ? s.location_muu : s.location,
          location_muu: s.location_muu,
          sub_location: s.sub_location === 'Muu' ? s.sub_location_muu : s.sub_location,
          sub_location_muu: s.sub_location_muu,
          material: materialStr || s.materials.join(', '),
          materials: s.materials,
          material_muu: s.material_muu,
          area_m2: s.area_m2 ? parseFloat(s.area_m2) : null,
          description: s.notes || null,
          photo_url,
          bag_photo_url,
        });
      }
      // Redirect to Stripe checkout
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surveyId: survey.id,
          sampleCount: samples.length,
          surveyAddress: address,
        }),
      });
      const { url, error: checkoutError } = await res.json();
      if (checkoutError || !url) {
        alert('Maksun aloitus epäonnistui. Yritä uudelleen.');
        setSaving(false);
        return;
      }
      window.location.href = url;
    } catch (e) {
      console.error('handleSubmit error:', e);
      alert('Odottamaton virhe. Yritä uudelleen.');
      setSaving(false);
    }
  };

  const btnStyle = (active: boolean) => ({
    borderColor: active ? '#2563EB' : '#D1D5DB',
    color: active ? '#2563EB' : '#1C1C1E',
    background: active ? '#EFF6FF' : 'white',
  });

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center gap-3" style={{ borderColor: 'var(--border)' }}>
        <button onClick={() => step > 1 ? setStep(step - 1) : router.back()} className="text-xl w-8">←</button>
        <div className="flex-1">
          <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Vaihe {step}/3</p>
          <p className="text-sm font-bold">{step === 1 ? 'Perustiedot' : step === 2 ? 'Näytteet' : 'Lähetys'}</p>
        </div>
        <div className="flex gap-1">
          {[1,2,3].map(i => (
            <div key={i} className="w-2 h-2 rounded-full" style={{ background: i <= step ? 'var(--accent)' : 'var(--border)' }} />
          ))}
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto pb-32">

        {/* STEP 1 - Perustiedot */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Kohteen osoite *</label>
              <AddressInput value={address} onChange={setAddress} onCityChange={setCity} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tilaajan nimi *</label>
              <input
                type="text"
                value={tilaajaNimi}
                onChange={e => { setTilaajaNimi(e.target.value); setNimiError(''); }}
                placeholder="esim. Matti Meikäläinen"
                className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 bg-white"
                style={{ borderColor: nimiError ? '#EF4444' : 'var(--border)' }}
              />
              {nimiError && <p className="text-xs text-red-500 mt-1">{nimiError}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tilaajan sähköposti *</label>
              <input
                type="email"
                value={tilaajaSahkoposti}
                onChange={e => { setTilaajaSahkoposti(e.target.value); setEmailError(''); }}
                placeholder="esim. asiakas@email.com"
                className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 bg-white"
                style={{ borderColor: emailError ? '#EF4444' : 'var(--border)' }}
              />
              {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tilaajan puhelinnumero</label>
              <input
                type="tel"
                value={tilaajaPuhelin}
                onChange={e => setTilaajaPuhelin(e.target.value)}
                placeholder="esim. 040 123 4567"
                className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 bg-white"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Päivämäärä</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-sm outline-none bg-white" style={{ borderColor: 'var(--border)' }} />
            </div>

            {/* Kohteen tyyppi */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted)' }}>KOHTEEN TYYPPI</p>
              <div className="flex gap-2 flex-wrap">
                {['Pintaremontti', 'Yksittäiset näytteet', 'Muu'].map(t => (
                  <button key={t} onClick={() => setKohdeTyyppi(t)} className="px-3 py-2 rounded-xl text-sm font-medium border transition-colors" style={btnStyle(kohde_tyyppi === t)}>
                    {t}
                  </button>
                ))}
              </div>
              {kohde_tyyppi === 'Muu' && (
                <input value={kohde_muu} onChange={e => setKohdeMuu(e.target.value)} placeholder="Kuvaile..." className="mt-2 w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500" style={{ borderColor: 'var(--border)' }} />
              )}
            </div>


            <button
              onClick={() => {
                if (!tilaajaNimi.trim()) { setNimiError('Tilaajan nimi on pakollinen'); return; }
                const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tilaajaSahkoposti);
                if (!emailOk) { setEmailError('Anna kelvollinen sähköpostiosoite'); return; }
                setStep(2);
              }}
              disabled={!address}
              className="w-full py-4 rounded-2xl text-white font-semibold mt-2 disabled:opacity-40"
              style={{ background: 'var(--accent)' }}
            >
              Seuraava →
            </button>
          </div>
        )}

        {/* STEP 2 - Näytteet */}
        {step === 2 && (
          <div>
            <div className="space-y-4 mb-4">
              {samples.map((s) => (
                <div key={s.id} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: 'var(--primary)' }}>{s.sample_code}</span>
                    <button onClick={() => removeSample(s.id)} className="text-red-400 text-sm font-medium">Poista</button>
                  </div>

                  {/* Sijainti */}
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted)' }}>SIJAINTI</p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {LOCATIONS.map(loc => (
                      <button key={loc} onClick={() => updateSample(s.id, { location: loc, location_muu: loc !== 'Muu' ? '' : s.location_muu })}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                        style={btnStyle(s.location === loc)}>
                        {loc}
                      </button>
                    ))}
                  </div>
                  {s.location === 'Muu' && (
                    <input value={s.location_muu} onChange={e => updateSample(s.id, { location_muu: e.target.value })} placeholder="Kuvaile sijainti..." className="w-full border rounded-lg px-3 py-2 text-xs mb-2 outline-none focus:border-blue-500" style={{ borderColor: 'var(--border)' }} />
                  )}

                  {/* Sub-location S/L */}
                  {s.location && (
                    <div className="flex gap-2 mb-3">
                      {['S — Seinä', 'L — Lattia', 'Muu'].map(sl => (
                        <button key={sl} onClick={() => updateSample(s.id, { sub_location: sl })}
                          className="flex-1 py-1.5 rounded-lg text-xs font-medium border"
                          style={btnStyle(s.sub_location === sl)}>
                          {sl}
                        </button>
                      ))}
                    </div>
                  )}
                  {s.sub_location === 'Muu' && (
                    <input value={s.sub_location_muu} onChange={e => updateSample(s.id, { sub_location_muu: e.target.value })} placeholder="Kuvaile..." className="w-full border rounded-lg px-3 py-2 text-xs mb-2 outline-none focus:border-blue-500" style={{ borderColor: 'var(--border)' }} />
                  )}

                  {/* Materiaali (multi-select) */}
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted)' }}>MATERIAALI</p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {MATERIALS.map(mat => {
                      const active = s.materials.includes(mat);
                      return (
                        <button key={mat} onClick={() => toggleMaterial(s.id, mat)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                          style={btnStyle(active)}>
                          {active ? `✓ ${mat}` : mat}
                        </button>
                      );
                    })}
                  </div>
                  {s.materials.includes('Muu') && (
                    <input value={s.material_muu} onChange={e => updateSample(s.id, { material_muu: e.target.value })} placeholder="Kuvaile materiaali..." className="w-full border rounded-lg px-3 py-2 text-xs mb-2 outline-none focus:border-blue-500" style={{ borderColor: 'var(--border)' }} />
                  )}

                  {/* Pinta-ala */}
                  <div className="mb-3">
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted)' }}>PINTA-ALA (m²)</p>
                    <input type="number" value={s.area_m2} onChange={e => updateSample(s.id, { area_m2: e.target.value })} placeholder="esim. 12.5" className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" style={{ borderColor: 'var(--border)' }} />
                  </div>

                  {/* Muistiinpanot */}
                  <textarea value={s.notes} onChange={e => updateSample(s.id, { notes: e.target.value })} rows={2} placeholder="Vapaaehtoinen kuvaus..." className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none mb-3" style={{ borderColor: 'var(--border)' }} />

                  {/* Kuva kohteesta */}
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>Kuva näytekohdasta (mistä näyte otettiin)</p>
                  <label className="block cursor-pointer">
                    <div className="border-2 border-dashed rounded-xl py-3 text-center text-sm" style={{ borderColor: s.photoPreview ? 'var(--accent)' : 'var(--border)', color: s.photoPreview ? 'var(--accent)' : 'var(--muted)' }}>
                      {s.photoPreview ? '✓ Kuva lisätty' : '📷 Ota kuva kohteesta'}
                    </div>
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={e => { if (e.target.files?.[0]) handlePhoto(s.id, e.target.files[0]); }} />
                  </label>
                  {s.photoPreview && <img src={s.photoPreview} className="mt-2 w-full h-32 object-cover rounded-xl" alt="Näytteen kuva" />}

                  {/* Kuva näytepussista */}
                  <p className="text-xs font-medium mt-3 mb-1" style={{ color: 'var(--muted)' }}>Kuva merkitystä näytepussista (merkintä näkyvissä)</p>
                  <label className="block cursor-pointer">
                    <div className="border-2 border-dashed rounded-xl py-3 text-center text-sm" style={{ borderColor: s.bagPhotoPreview ? 'var(--accent)' : 'var(--border)', color: s.bagPhotoPreview ? 'var(--accent)' : 'var(--muted)' }}>
                      {s.bagPhotoPreview ? '✓ Kuva pussista lisätty' : '🧪 Ota kuva pussista'}
                    </div>
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={e => { if (e.target.files?.[0]) handleBagPhoto(s.id, e.target.files[0]); }} />
                  </label>
                  {s.bagPhotoPreview && <img src={s.bagPhotoPreview} className="mt-2 w-full h-32 object-cover rounded-xl" alt="Näytepussin kuva" />}
                </div>
              ))}
            </div>

            <button onClick={addSample} className="w-full py-3 rounded-2xl border-2 border-dashed text-sm font-semibold mb-4" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
              + Lisää näyte
            </button>
            <button onClick={() => setStep(3)} disabled={samples.length === 0} className="w-full py-4 rounded-2xl text-white font-semibold disabled:opacity-40" style={{ background: 'var(--accent)' }}>
              Seuraava →
            </button>
          </div>
        )}

        {/* STEP 3 - Lähetys */}
        {step === 3 && (
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-4 text-center">
              <div className="text-4xl mb-3">📦</div>
              <h2 className="font-bold text-base mb-2">Valmis lähetykseen</h2>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Merkitse näytepussit tunnuksella ja toimita laboratorioon.</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <p className="text-xs font-semibold mb-3" style={{ color: 'var(--muted)' }}>YHTEENVETO</p>
              <p className="text-sm font-medium">{address}</p>
              <p className="text-xs mt-0.5 mb-3" style={{ color: 'var(--muted)' }}>{new Date(date).toLocaleDateString('fi-FI')}{kohde_tyyppi ? ` · ${kohde_tyyppi === 'Muu' ? kohde_muu : kohde_tyyppi}` : ''}</p>
              {samples.map(s => (
                <div key={s.id} className="flex items-center justify-between py-2 border-t text-sm" style={{ borderColor: 'var(--border)' }}>
                  <span className="font-bold text-xs" style={{ color: 'var(--muted)' }}>{s.sample_code}</span>
                  <span className="text-xs">{s.location === 'Muu' ? s.location_muu : s.location}{s.sub_location ? ` · ${s.sub_location}` : ''} · {s.materials.filter(m => m !== 'Muu').join(', ')}{s.material_muu ? ` · ${s.material_muu}` : ''}</span>
                </div>
              ))}
            </div>
            <button onClick={handleSubmit} disabled={saving} className="w-full py-4 rounded-2xl text-white font-semibold disabled:opacity-50" style={{ background: '#10B981' }}>
              {saving ? 'Valmistellaan maksua...' : `Maksa ja lähetä — ${samples.length} × 39,90€ + ALV`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
