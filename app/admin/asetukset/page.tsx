'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { AppSettings } from '@/lib/supabase';

const SETTINGS_ID = '00000000-0000-0000-0000-000000000001';

export default function AdminSettingsPage() {
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

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Asetukset</h1>

      <div className="space-y-6">
        {/* Logo */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Yrityksen logo</h2>
          <div className="flex items-center gap-4">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Logo"
                className="h-16 object-contain border rounded-lg p-2 bg-gray-50"
              />
            ) : (
              <div className="h-16 w-32 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400 text-xs">
                Ei logoa
              </div>
            )}
            <label className="cursor-pointer px-4 py-2 rounded-lg text-sm font-medium border border-blue-200 text-blue-600 hover:bg-blue-50">
              Lataa logo
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
            </label>
          </div>
        </div>

        {/* Signature */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Allekirjoitus</h2>
          <div className="flex items-center gap-4">
            {sigPreview ? (
              <img
                src={sigPreview}
                alt="Allekirjoitus"
                className="h-12 object-contain border rounded-lg p-2 bg-gray-50"
              />
            ) : (
              <div className="h-12 w-32 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400 text-xs">
                Ei allekirjoitusta
              </div>
            )}
            <label className="cursor-pointer px-4 py-2 rounded-lg text-sm font-medium border border-blue-200 text-blue-600 hover:bg-blue-50">
              Lataa allekirjoitus
              <input type="file" accept="image/*" className="hidden" onChange={handleSigChange} />
            </label>
          </div>
        </div>

        {/* Company info */}
        <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">Yrityksen tiedot</h2>
          {[
            { key: 'company_name', label: 'Yrityksen nimi' },
            { key: 'kartoittaja_name', label: 'Kartoittajan nimi' },
            { key: 'kartoittaja_title', label: 'Titteli' },
            { key: 'kartoittaja_credentials', label: 'Pätevyydet / lisätiedot' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                value={(settings as Record<string, string>)[key] || ''}
                onChange={e => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>
          ))}
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="w-full py-3 rounded-xl text-white font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? '...' : saved ? '✓ Tallennettu' : 'Tallenna asetukset'}
        </button>
      </div>
    </div>
  );
}
