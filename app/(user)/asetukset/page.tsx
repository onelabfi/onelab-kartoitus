'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { AppSettings } from '@/lib/supabase';
import { useLang } from '@/lib/LangContext';
import { useRouter } from 'next/navigation';
import type { Lang } from '@/lib/i18n';

const SETTINGS_ID = '00000000-0000-0000-0000-000000000001';

const cardStyle = { background: '#2C2C2E', border: '1px solid rgba(255,255,255,0.08)' };
const inputStyle = { background: '#3A3A3C', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' };

export default function SettingsPage() {
  const { lang, setLang } = useLang();
  const router = useRouter();

  // App settings (logo, signature, company/kartoittaja info)
  const [settings, setSettings] = useState<Partial<AppSettings>>({
    company_name: '',
    kartoittaja_name: '',
    kartoittaja_title: 'Asbestikartoittaja',
    kartoittaja_credentials: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [sigFile, setSigFile] = useState<File | null>(null);
  const [sigPreview, setSigPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase
      .from('app_settings')
      .select('*')
      .eq('id', SETTINGS_ID)
      .single()
      .then(({ data }) => {
        if (data) {
          setSettings(data);
          if (data.logo_url) setLogoPreview(data.logo_url);
          if (data.signature_url) setSigPreview(data.signature_url);
        }
      });
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSigFile(file);
    setSigPreview(URL.createObjectURL(file));
  };

  const save = async () => {
    setSaving(true);
    let logo_url = settings.logo_url || null;
    let signature_url = settings.signature_url || null;

    if (logoFile) {
      await supabase.storage.from('admin-assets').upload('logo', logoFile, { upsert: true });
      const { data } = supabase.storage.from('admin-assets').getPublicUrl('logo');
      logo_url = data.publicUrl + '?t=' + Date.now();
    }
    if (sigFile) {
      await supabase.storage.from('admin-assets').upload('signature', sigFile, { upsert: true });
      const { data } = supabase.storage.from('admin-assets').getPublicUrl('signature');
      signature_url = data.publicUrl + '?t=' + Date.now();
    }

    await supabase.from('app_settings').upsert({
      id: SETTINGS_ID,
      ...settings,
      logo_url,
      signature_url,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  const langs: { code: Lang; label: string }[] = [
    { code: 'fi', label: 'Suomi' },
    { code: 'en', label: 'English' },
    { code: 'sv', label: 'Svenska' },
  ];
  const btnActive = { borderColor: '#2563EB', color: '#2563EB', background: 'rgba(37,99,235,0.15)' };
  const btnInactive = { borderColor: 'rgba(255,255,255,0.1)', color: '#8E8E93', background: 'transparent' };

  return (
    <div className="p-4 pt-8 pb-28" style={{ background: '#1C1C1E', minHeight: '100vh' }}>
      <h1 className="text-2xl font-black text-white mb-6">Asetukset</h1>

      <div className="space-y-4">
        {/* Language */}
        <div className="rounded-2xl p-4" style={cardStyle}>
          <p className="text-xs font-bold mb-3" style={{ color: '#8E8E93' }}>KIELI</p>
          <div className="flex gap-2">
            {langs.map(l => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className="flex-1 py-2 rounded-xl text-sm font-bold border transition-colors"
                style={lang === l.code ? btnActive : btnInactive}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Logo */}
        <div className="rounded-2xl p-4" style={cardStyle}>
          <p className="text-xs font-bold mb-3" style={{ color: '#8E8E93' }}>YRITYKSEN LOGO</p>
          <div className="flex items-center gap-4">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Logo"
                className="h-14 object-contain rounded-xl p-2"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            ) : (
              <div
                className="h-14 w-28 rounded-xl flex items-center justify-center text-xs"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.2)', color: '#8E8E93' }}
              >
                Ei logoa
              </div>
            )}
            <label
              className="cursor-pointer px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.4)', color: '#60A5FA' }}
            >
              Lataa logo
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
            </label>
          </div>
        </div>

        {/* Signature */}
        <div className="rounded-2xl p-4" style={cardStyle}>
          <p className="text-xs font-bold mb-3" style={{ color: '#8E8E93' }}>ALLEKIRJOITUS</p>
          <div className="flex items-center gap-4">
            {sigPreview ? (
              <img
                src={sigPreview}
                alt="Allekirjoitus"
                className="h-12 object-contain rounded-xl p-2"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            ) : (
              <div
                className="h-12 w-28 rounded-xl flex items-center justify-center text-xs"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.2)', color: '#8E8E93' }}
              >
                Ei allekirjoitusta
              </div>
            )}
            <label
              className="cursor-pointer px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.4)', color: '#60A5FA' }}
            >
              Lataa allekirjoitus
              <input type="file" accept="image/*" className="hidden" onChange={handleSigChange} />
            </label>
          </div>
        </div>

        {/* Company info */}
        <div className="rounded-2xl p-4" style={cardStyle}>
          <p className="text-xs font-bold mb-3" style={{ color: '#8E8E93' }}>YRITYKSEN TIEDOT</p>
          <div className="space-y-3">
            {[
              { key: 'company_name', label: 'Yrityksen nimi' },
              { key: 'kartoittaja_name', label: 'Kartoittajan nimi' },
              { key: 'kartoittaja_title', label: 'Titteli' },
              { key: 'kartoittaja_credentials', label: 'Pätevyydet / lisätiedot' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-medium mb-1" style={{ color: '#8E8E93' }}>{label}</label>
                <input
                  value={(settings as Record<string, string>)[key] || ''}
                  onChange={e => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={save}
          disabled={saving}
          className="w-full py-3 rounded-2xl text-white text-sm font-bold disabled:opacity-50"
          style={{ background: saved ? '#10B981' : 'linear-gradient(135deg, #1B3A6B, #2563EB)' }}
        >
          {saving ? 'Tallennetaan...' : saved ? '✓ Tallennettu' : 'Tallenna asetukset'}
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full py-3 rounded-2xl text-sm font-bold border"
          style={{ borderColor: 'rgba(239,68,68,0.4)', color: '#EF4444', background: 'rgba(239,68,68,0.08)' }}
        >
          Kirjaudu ulos
        </button>

        <p className="text-center text-xs mt-4" style={{ color: '#8E8E93' }}>Analyysi: Onelab</p>
      </div>
    </div>
  );
}
